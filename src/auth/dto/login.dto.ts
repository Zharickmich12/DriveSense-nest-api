import { IsEmail, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
    @ApiProperty({
        description: 'Email del usuario',
        example: 'usuario@example.com',
    })
    @IsEmail()
    @Transform(({ value }) => value?.toLowerCase())
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Password123',
        minLength: 8,
        maxLength: 32,
    })
    @Length(8, 32, {message: 'Password must be between 8 and 32 characters'})
    password: string;
}