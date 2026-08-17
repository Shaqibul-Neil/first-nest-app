import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ProfileDto {
  @IsInt()
  @Min(0)
  @Max(150)
  age!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  qualification!: string;
}
