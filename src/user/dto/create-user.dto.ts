import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ValidateNested()
  //@ValidateNested() — bole dey: bhitorer object tar bhitoreo dhuke validate koro. Ei ta na dile address: { street: 123, city: null }
  @Type(() => AddressDto)
  address!: AddressDto;

  //JSON theke asha nested address ekta plain object. class-validator jane na eta kon class er niyome check korbe — runtime e ei information TypeScript type theke pawa jay na (TS types compile er por mure jay). @Type() class-transformer ke bole: "ei nested object take AddressDto instance e convert koro". Convert howar por @ValidateNested() bujhte pare kon rules apply korbe. Ei duita ekshathe lage. Ekta bad dile nested validation puropuri chup kore fail kore — silently.
}
