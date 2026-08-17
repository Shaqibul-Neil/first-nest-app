import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ProfileDto } from './profile.dto';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile!: ProfileDto;
}
