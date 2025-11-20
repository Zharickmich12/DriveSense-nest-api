import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Email of the user',
    example: 'johndoe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Password (min 8 characters)',
    example: 'securePassword123',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    example: 'user',
    enum: ['admin', 'user'],
  })
  role?: 'admin' | 'user';
}