import { IsOptional } from 'class-validator';

export class createPembeliDto {
  @IsOptional()
  user_id: number;

  @IsOptional()
  NamaLengkap: string;

  @IsOptional()
  paket: string;
  //     @Column()
  //   NamaLengkap: string;

  //   @Column({ default: false })
  //   JualVerified: boolean;

  //   @Column()
  //   paket: string;
}
