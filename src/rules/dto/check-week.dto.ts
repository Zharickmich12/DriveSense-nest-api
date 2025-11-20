import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckWeekDto {
  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({
    description: 'ID de la ciudad donde se consulta la restricción semanal',
    example: 1,
  })
  @IsNumber()
  cityId: number;

  @ApiPropertyOptional({
    description: 'Fecha opcional en formato YYYY-MM-DD',
    example: '2025-11-20',
  })
  @IsOptional()
  @IsString()
  date: string;
}