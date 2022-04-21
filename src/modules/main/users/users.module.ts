import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/modules/support/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register(jwtConfig),
    ConfigModule,
    EmailModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
