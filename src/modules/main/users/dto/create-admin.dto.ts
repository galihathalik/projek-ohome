import { IsOptional } from 'class-validator';

export class CreatAdminDto {
  @IsOptional()
  user_id: number;

  @IsOptional()
  NamaLengkap: string;

  @IsOptional()
  foto: string;
}
