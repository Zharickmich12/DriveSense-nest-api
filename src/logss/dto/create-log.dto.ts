import { IsOptional, IsString, IsInt } from "class-validator";
import { ApiHideProperty } from '@nestjs/swagger';

export class CreateLogDto {

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  user?: string;

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  method?: string;

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  endpoint?: string;

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  body?: string;

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  vehiclePlate?: string;

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  result?: string;

  @IsOptional()
  @IsInt()
  @ApiHideProperty()
  cityId?: number;

  @IsOptional()
  @IsInt()
  @ApiHideProperty()
  vehicleId?: number;
}