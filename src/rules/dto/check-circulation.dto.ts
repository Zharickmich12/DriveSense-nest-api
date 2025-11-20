import { IsString, IsNumber, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckCirculationDto {
  @ApiProperty({
    description: 'Placa del vehículo: 3 letras seguidas de 3 números',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]{3}[0-9]{3}$/, {
    message: 'La placa debe tener 3 letras seguidas de 3 números',
  })
  plate: string;

  @ApiProperty({
    description: 'ID de la ciudad donde se valida la circulación',
    example: 1,
  })
  @IsNumber()
  cityId: number;

  @ApiProperty({
    description: 'Fecha en formato YYYY-MM-DD',
    example: '2025-11-20',
  })
  @IsString()
  @IsNotEmpty()
  date: string;
}