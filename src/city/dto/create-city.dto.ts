import { MinLength, IsString, IsOptional, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCityDto {

    @ApiProperty({
        description: 'Name of the city. Must have at least 3 characters.',
        example: 'Bogotá',
        minLength: 3,
    })
    @IsString()
    @MinLength(3, { message: 'The name must have at least 3 characters.' })
    @Transform(({ value }) => 
        value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase()
    )
    name: string;

    @ApiPropertyOptional({
        description: 'Optional description of the city.',
        example: 'Capital city with heavy traffic restrictions.',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Indicates whether the city has the system active.',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}