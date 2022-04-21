import {
  IsEmail,
  isEmail,
  IsNotEmpty,
  isNotEmpty,
  IsOptional,
} from 'class-validator';

export class udpdateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  num_phone: string;
}
