import { IsEmail, Length } from 'class-validator';

export class LoginDTO {
    @IsEmail()
    email: string;

    @Length(8, 32, {message: 'Password must be between 8 and 32 characters'})
    password: string;
}