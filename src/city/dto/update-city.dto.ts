import { PartialType } from '@nestjs/mapped-types';
import { CreateCityDto } from './create-city.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCityDto extends PartialType(CreateCityDto) {
  
  @ApiPropertyOptional({
    description: 'Name of the city',
    example: 'Bogotá',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Optional description of the city',
    example: 'Capital city.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Indicates whether the city is active',
    example: true,
  })
  isActive?: boolean;
}