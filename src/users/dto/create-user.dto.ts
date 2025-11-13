import { IsString, IsEmail, MinLength, IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(['admin','user'])
  role?: 'admin' | 'user';
}
