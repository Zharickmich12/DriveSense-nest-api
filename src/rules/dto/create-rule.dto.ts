import { IsInt, ArrayNotEmpty, IsArray, IsString, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRuleDto {

    @ApiProperty({
        description: 'Día de la semana al que aplica la regla',
        example: 'Lunes'
    })
    @IsString()
    @IsNotEmpty({ message: 'The day of the week is required.' })
    dayOfWeek: string;

    @ApiProperty({
        description: 'Hora de inicio de la restricción en formato HH:mm',
        example: '06:30'
    })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'The time must be in HH:mm format (for example: 06:30)' })
    startTime: string;

    @ApiProperty({
        description: 'Hora de fin de la restricción en formato HH:mm',
        example: '08:30'
    })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'The time must be in HH:mm format (e.g., 07:30).' })
    endTime: string;

    @ApiProperty({
        description: 'Dígitos finales de placa restringidos',
        example: ['1', '2', '3']
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'It must include at least one restricted digit."' })
    restrictedDigits: string[];

    @ApiProperty({
        description: 'ID de la ciudad a la que pertenece esta regla',
        example: 1
    })
    @IsInt()
    cityId: number;
}