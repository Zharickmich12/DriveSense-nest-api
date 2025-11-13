import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 32, {message: 'La contraseña no tiene el número de caracteres requerido'})
    password: string;
}
