import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class refreshAccessTokenDTO {
  @IsNotEmpty()
  refresh_token: string;
}
