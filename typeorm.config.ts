import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';


dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  
  type: (process.env.DB_TYPE as any) || 'mysql', 
  
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'DriveSenseDB',
 
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}', 
  ],
 
  synchronize: false, 
  
  
  logging: true,
  
  migrationsTableName: 'migrations',
  migrations: [
    __dirname + '/../migrations/*{.ts,.js}',
  ],
};

export default typeOrmConfig;
