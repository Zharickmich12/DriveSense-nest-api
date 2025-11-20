import { Transform } from 'class-transformer';
import { IsString, IsEmail, MinLength, IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase())
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @ApiProperty({
    description: 'Password (min 8 characters)',
    example: 'securePassword123',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    example: 'user',
    enum: ['admin', 'user'],
  })
  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}