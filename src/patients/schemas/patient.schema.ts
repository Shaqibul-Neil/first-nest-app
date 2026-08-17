import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  MergeType,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { Profile } from './profile.schema';

// One-to-One Relationship using Referencing
@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, trim: true, maxLength: 100 })
  name!: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId, //"ki dhoroner field" — blueprint
    ref: Profile.name, //populate() ke bole kon collection theke ante hobe. Profile.name = 'Profile' string, kintu hardcode na — class rename korle nije bodlabe. Module er { name: Profile.name, ... } er sathe ek jaiga theke ase.
    required: true,
    unique: true, // one to one relation
  })
  profile!: Types.ObjectId; // "ki dhoroner value" — TS type
}

export type PatientDocument = HydratedDocument<Patient>;
export type PopulatePatient = MergeType<PatientDocument, { profile: Profile }>;
export const PatientSchema = SchemaFactory.createForClass(Patient);
