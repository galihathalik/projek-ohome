import {
  IsEmail,
  isEmail,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  MinLength,
  minLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @MinLength(11)
  num_phone: string;
}
