import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Profile {
  //Database level validation. DTO er @IsNotEmpty() API level. Duita alada layer — keu direct DB e likhle DTO bypass hoy, required bypass hoy na.
  @Prop({ required: true, min: 0, max: 150 })
  age!: number;

  @Prop({ required: true, trim: true, maxLength: 200 })
  qualification!: string;
}

export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
