import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { City } from '../city/entities/city.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { FilterLogDto } from './dto/filter-log.dto';

describe('LogsService', () => {
  let service: LogsService;
  let logRepo: any;
  let cityRepo: any;
  let vehicleRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        { provide: getRepositoryToken(Log), useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn() } },
        { provide: getRepositoryToken(City), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(Vehicle), useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
    logRepo = module.get(getRepositoryToken(Log));
    cityRepo = module.get(getRepositoryToken(City));
    vehicleRepo = module.get(getRepositoryToken(Vehicle));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a log without city and vehicle', async () => {
      const dto: CreateLogDto = { user: 'John', method: 'POST', endpoint: '/logs' };
      const mockLog = { ...dto };
      logRepo.create.mockReturnValue(mockLog);
      logRepo.save.mockResolvedValue(mockLog);

      const result = await service.create(dto);

      expect(logRepo.create).toHaveBeenCalledWith(dto);
      expect(logRepo.save).toHaveBeenCalledWith(mockLog);
      expect(result).toEqual(mockLog);
    });

    it('should create a log with city and vehicle', async () => {
      const dto: CreateLogDto = { user: 'John', cityId: 1, vehicleId: 2 };
      const city = { id: 1, name: 'Test City' };
      const vehicle = { id: 2, licensePlate: 'ABC123' };
      cityRepo.findOne.mockResolvedValue(city);
      vehicleRepo.findOne.mockResolvedValue(vehicle);

      const mockLog = { user: 'John', city, vehicle };
      logRepo.create.mockReturnValue(mockLog);
      logRepo.save.mockResolvedValue(mockLog);

      const result = await service.create(dto);

      expect(cityRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(vehicleRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(logRepo.create).toHaveBeenCalledWith({ user: 'John', city, vehicle });
      expect(logRepo.save).toHaveBeenCalledWith(mockLog);
      expect(result).toEqual(mockLog);
    });

    it('should throw NotFoundException if city not found', async () => {
      const dto: CreateLogDto = { user: 'John', cityId: 999 };
      cityRepo.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      const dto: CreateLogDto = { user: 'John', vehicleId: 999 };
      vehicleRepo.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all logs without filters', async () => {
      const logs = [{ id: 1, user: 'John' }];
      logRepo.find.mockResolvedValue(logs);

      const result = await service.findAll();

      expect(logRepo.find).toHaveBeenCalledWith({ where: {}, relations: ['city', 'vehicle'], order: { createdAt: 'DESC' } });
      expect(result).toEqual(logs);
    });

    it('should filter logs by user', async () => {
      const filters: FilterLogDto = { user: 'John' };
      const logs = [{ id: 1, user: 'John' }];
      logRepo.find.mockResolvedValue(logs);

      const result = await service.findAll(filters);

      expect(logRepo.find).toHaveBeenCalledWith({ where: { user: 'John' }, relations: ['city', 'vehicle'], order: { createdAt: 'DESC' } });
      expect(result).toEqual(logs);
    });

    it('should filter logs by vehicleId', async () => {
      const filters: FilterLogDto = { vehicleId: 2 };
      const logs = [{ id: 1, vehicle: { id: 2 } }];
      logRepo.find.mockResolvedValue(logs);

      const result = await service.findAll(filters);

      expect(logRepo.find).toHaveBeenCalledWith({ where: { vehicle: { id: 2 } }, relations: ['city', 'vehicle'], order: { createdAt: 'DESC' } });
      expect(result).toEqual(logs);
    });
  });
});