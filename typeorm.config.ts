import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT') || '3306'),
  username: configService.get('DB_USERNAME') || 'root',
  password: configService.get('DB_PASSWORD') || '',
  database: configService.get('DB_NAME') || 'DriveSenseDB',
  entities: ['src//*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});