import { IsOptional, IsString, IsInt } from "class-validator";
import { ApiHideProperty } from '@nestjs/swagger';

export class FilterLogDto {

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  user?: string;

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  vehiclePlate?: string;

  @IsOptional()
  @IsInt()
  @ApiHideProperty()
  cityId?: number;

  @IsOptional()
  @ApiHideProperty()
  startDate?: string; // formato YYYY-MM-DD

  @IsOptional()
  @ApiHideProperty()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @ApiHideProperty()
  vehicleId?: number;
}