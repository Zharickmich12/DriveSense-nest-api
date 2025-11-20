import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: any;

  const mockUser: Partial<User> = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'user',
  };

  beforeEach(async () => {
    mockRepo = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneRaw', () => {
    it('should return a user if found', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockUser);
      const user = await service.findOneRaw(1);
      expect(user).toEqual(mockUser);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOneRaw(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return sanitized user', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('findAll', () => {
    it('should return array of sanitized users', async () => {
      mockRepo.find.mockResolvedValue([mockUser, { ...mockUser, id: 2 }]);
      const result = await service.findAll();
      expect(result.length).toBe(2);
      expect(result[0]).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('update', () => {
    it('should hash password and update user', async () => {
      const dto = { name: 'Updated', password: 'newpassword' };
      mockRepo.findOneBy.mockResolvedValue({ ...mockUser });
      mockRepo.save.mockImplementation(user => Promise.resolve(user));

      const result = await service.update(1, dto);
      expect(result.name).toBe('Updated');
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove user and return sanitized user', async () => {
      mockRepo.findOneBy.mockResolvedValue({ ...mockUser });
      mockRepo.remove.mockResolvedValue(mockUser);

      const result = await service.remove(1);
      expect(result.message).toBe('User deleted successfully');
      expect(result.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });
});