import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//ei class ta mongoose schema er blueprint bole dey. Nije kichu banay na, shudhu metadata jomiye rakhe (reflect-metadata diye).
@Schema({ _id: false })
//_id: false — Address holo subdocument (User er bhitore boshe). Default e Mongoose protita subdocument ke alada ObjectId dey. Address er nijer identity dorkar nai, tai off korlam.
export class Address {
  //@Prop() — protita field ke schema path banay.  Extra rules dite paro: @Prop({ required: true, default: 'Dhaka' })
  @Prop()
  street!: string;

  @Prop()
  city!: string;
}

// ei line tai asol mongoose.Schema object banay, oi metadata theke. Class holo compile-time blueprint; AddressSchema holo runtime value ja Mongoose bujhe.
export const AddressSchema = SchemaFactory.createForClass(Address);
