import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  findAll(limit = 10, page = 1) {
    return this.usersRepo.find({
      take: limit,
      skip: (page - 1) * limit,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const u = await this.usersRepo.findOneBy({ id });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.usersRepo.remove(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
  }
}