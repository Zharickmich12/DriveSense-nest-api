import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: (process.env.DB_TYPE as any) || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'DriveSenseDB',
  entities: [
    path.join(__dirname, '/src/**/*.entity{.ts,.js}'),
  ],
  synchronize: false,
  logging: true,
  migrationsTableName: 'migrations',
  migrations: [
    path.join(__dirname, '/src/migrations/*{.ts,.js}'),
  ],
};

export const typeOrmConfig: TypeOrmModuleOptions = dataSourceOptions;

export default new DataSource(dataSourceOptions);
