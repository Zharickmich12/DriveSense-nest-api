import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'drivesensedb',
  entities: [path.join(__dirname + '/src/**/*.entity{.ts,.js}')], 
  migrations: [path.join(__dirname + '/src/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
};