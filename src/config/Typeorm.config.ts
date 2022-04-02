import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'db-projek-tim',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
};
