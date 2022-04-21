import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/main/users/users.module';
import { AuthModule } from 'src/modules/main/auth/auth.module';
import { Pembeli } from './entities/pembeli.entity';
import { User } from './entities/user.entity';
import { Admin } from './entities/admin.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import appConfig, { DbConfigMysql, DbConfigRedis } from 'src/config/app.config';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

const dbConfigMysql: DbConfigMysql = appConfig().db.mysql;
const dbConfigRedis: DbConfigRedis = appConfig().db.redis;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: dbConfigMysql.host,
      port: dbConfigMysql.port,
      username: dbConfigMysql.user,
      password: dbConfigMysql.password,
      database: dbConfigMysql.database,
      entities: [User, Admin, Pembeli, RefreshToken],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
