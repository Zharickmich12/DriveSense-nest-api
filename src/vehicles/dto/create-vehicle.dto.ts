import { IsString, IsNotEmpty, IsNumber, IsIn, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { VehicleType } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle license plate', example: 'ABC123' })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ description: 'Brand of the vehicle', example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ description: 'Model of the vehicle', example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ 
    description: 'Year of manufacture', 
    example: 2020, 
    minimum: 1900, 
    maximum: new Date().getFullYear() 
  })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({ 
    description: 'Type of vehicle', 
    example: 'car', 
    enum: ['car', 'motorcycle'] 
  })
  @IsString()
  @IsIn(['car', 'motorcycle'])
  type: VehicleType;
}