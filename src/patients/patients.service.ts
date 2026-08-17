import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Patient,
  PatientDocument,
  PopulatePatient,
} from './schemas/patient.schema';
import { Connection, isValidObjectId, Model } from 'mongoose';
import { Profile } from './schemas/profile.schema';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name)
    private patientModel: Model<Patient>,
    @InjectModel(Profile.name)
    private profileModel: Model<Profile>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  private ensureValidId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid patient id: ${id}`);
    }
  }
  async createPatient(dto: CreatePatientDto): Promise<PopulatePatient> {
    const session = await this.connection.startSession();

    try {
      let patientId!: PatientDocument['_id'];
      await session.withTransaction(async () => {
        const [profile] = await this.profileModel.create([dto.profile], {
          session, //MongoDB transaction automatic na. Protita write ke alada kore bolte hoy "tui ei transaction-er ongsho". { session } na dile oi write transaction-er bahire chole jay:
        });

        const [patient] = await this.patientModel.create(
          [{ name: dto.name, profile: profile._id }],
          { session },
        );

        patientId = patient._id;
      });
      return this.findOne(String(patientId));
    } finally {
      await session.endSession();
    }
  }

  async findAll(): Promise<PopulatePatient[]> {
    return this.patientModel
      .find()
      .populate<{ profile: Profile }>('profile')
      .exec();
  }

  async findOne(id: string): Promise<PopulatePatient> {
    this.ensureValidId(id);

    const patient = await this.patientModel
      .findById(id)
      .populate<{ profile: Profile }>('profile') //populate() query করার সময় related Profile document এনে result-এর মধ্যে বসিয়ে দেয়।
      .exec();

    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }
    return patient;
  }

  async removePatient(id: string): Promise<void> {
    this.ensureValidId(id);

    const patient = await this.patientModel.findById(id).exec();
    if (!patient)
      throw new NotFoundException(`Patient with id ${id} not found`);

    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.patientModel.deleteOne({ _id: patient._id }, { session });
        await this.profileModel.deleteOne(
          { _id: patient.get('profile')._id },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }
  }
}
