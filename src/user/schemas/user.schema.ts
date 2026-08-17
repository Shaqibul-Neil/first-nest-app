import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Address, AddressSchema } from './address.schema';

//One-to-One Relationship using Embedding
@Schema()
export class User {
  @Prop()
  name!: string;

  @Prop({ type: AddressSchema })
  //@Prop({ type: Address }) Mongoose type field e plain TypeScript class chine na. Ekhane lage — SchemaType, ekta Schema instance, othoba POJO(Plain Old JavaScript Object). Class dile Mongoose nested path gulo thik moto build korte pare na, casting/validation kaj kore na. Ekhon Mongoose jane: address ekta nested subdocument, jar bhitore street (String) ar city (String).
  address!: Address;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
