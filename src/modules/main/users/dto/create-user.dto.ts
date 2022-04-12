import {
  IsEmail,
  isEmail,
  isNotEmpty,
  IsNotEmpty,
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
}
