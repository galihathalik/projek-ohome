import { IsNotEmpty, isNotEmpty, IsString, isString } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export default TokenDto;
