import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // .lean() Mongoose ke bole hydration skip korte — kacha JS object dey,
  // Document class na. Read-only response er jonno druto ar halka.
  // Return type annotate korchi na — TS nije infer kore nite parbe.
  async getAllUsersLean() {
    return this.userModel.find().lean().exec();
  }

  // Duita side-by-side, difference ta chokhe dekhar jonno.
  async compareHydratedVsLean() {
    const hydrated = await this.userModel.findOne().exec();
    const lean = await this.userModel.findOne().lean().exec();

    return {
      hydrated: {
        constructorName: hydrated?.constructor.name,
        hasSaveMethod: hydrated !== null && 'save' in hydrated,
        isMongooseDoc: hydrated instanceof this.userModel,
        keys: hydrated === null ? [] : Object.keys(hydrated),
      },
      lean: {
        constructorName: lean?.constructor.name,
        hasSaveMethod: lean !== null && 'save' in lean,
        isMongooseDoc: lean instanceof this.userModel,
        keys: lean === null ? [] : Object.keys(lean),
      },
    };
  }
}
