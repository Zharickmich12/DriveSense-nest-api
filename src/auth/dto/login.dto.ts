import { IsEmail, Length } from 'class-validator';

export class LoginDTO {
    @IsEmail()
    email: string;

    @Length(8, 32, {message: 'La contraseña no tiene el número de caracteres requerido'})
    password: string;
}