import { IsNotEmpty, isNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  email: string;

  @IsOptional()
  name: string;

  @IsNotEmpty()
  password: string;
}
