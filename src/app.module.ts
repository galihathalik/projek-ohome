import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { typeOrmConfig } from './config/Typeorm.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [BooksModule, TypeOrmModule.forRoot(typeOrmConfig), UsersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
