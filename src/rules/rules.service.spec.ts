import { Test, TestingModule } from '@nestjs/testing';
import { RulesService } from './rules.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { City } from '../city/entities/city.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { LogsService } from '../logss/logs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

type CheckDayResult = { canCirculate: boolean; message: { es: string; en: string } };
type CheckWeekResult = { week: Array<{ day: string; canCirculate: boolean; message: { es: string; en: string } }> };

describe('RulesService', () => {
  let service: RulesService;
  let ruleRepo: Repository<Rule>;
  let cityRepo: Repository<City>;

  const mockRuleRepo = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockCityRepo = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  };

  const mockVehicleRepo = {};
  const mockLogsService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RulesService,
        { provide: getRepositoryToken(Rule), useValue: mockRuleRepo },
        { provide: getRepositoryToken(City), useValue: mockCityRepo },
        { provide: getRepositoryToken(Vehicle), useValue: mockVehicleRepo },
        { provide: LogsService, useValue: mockLogsService },
      ],
    }).compile();

    service = module.get<RulesService>(RulesService);
    ruleRepo = module.get<Repository<Rule>>(getRepositoryToken(Rule));
    cityRepo = module.get<Repository<City>>(getRepositoryToken(City));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a rule successfully', async () => {
      const dto = {
        dayOfWeek: 'Monday',
        startTime: '06:00',
        endTime: '08:30',
        restrictedDigits: ['1', '2'],
        cityId: 1,
      };

      const city = { id: 1, name: 'Bogotá' };
      mockCityRepo.findOneBy.mockResolvedValue(city);
      mockRuleRepo.findOne.mockResolvedValue(undefined);
      const savedRule = { ...dto, city };
      mockRuleRepo.create.mockReturnValue(savedRule);
      mockRuleRepo.save.mockResolvedValue(savedRule);

      const result = await service.create(dto);
      expect(result).toEqual({ message: 'Rule created successfully.', data: savedRule });
    });

    it('should throw NotFoundException if city not found', async () => {
      mockCityRepo.findOneBy.mockResolvedValue(null);
      await expect(
        service.create({ dayOfWeek: 'Monday', startTime: '06:00', endTime: '08:30', restrictedDigits: ['1'], cityId: 99 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkCirculation', () => {
    it('should return canCirculate true if no rules exist', async () => {
      mockCityRepo.findOne.mockResolvedValue({ id: 1, name: 'Bogotá' });
      mockRuleRepo.find.mockResolvedValue([]);

      const result = (await service.checkCirculation('ABC123', 1, '2025-11-10T07:00:00', false)) as CheckDayResult;
      expect(result.canCirculate).toBe(true);
    });

    it('should return canCirculate false if restricted', async () => {
      const city = { id: 1, name: 'Bogotá' };
      const rule = { dayOfWeek: 'Monday', startTime: '06:00', endTime: '08:30', restrictedDigits: ['3'], isActive: true };
      mockCityRepo.findOne.mockResolvedValue(city);
      mockRuleRepo.find.mockResolvedValue([rule]);

      const result = (await service.checkCirculation('ABC123', 1, '2025-11-10T06:30:00', false)) as CheckDayResult;
      expect(result.canCirculate).toBe(false);
    });

    it('should return week result when fullWeek=true', async () => {
      const city = { id: 1, name: 'Bogotá' };
      const rule = { dayOfWeek: 'Monday', startTime: '06:00', endTime: '08:30', restrictedDigits: ['3'], isActive: true };
      mockCityRepo.findOne.mockResolvedValue(city);
      mockRuleRepo.find.mockResolvedValue([rule]);

      const result = (await service.checkCirculation('ABC123', 1, undefined, true)) as CheckWeekResult;
      expect(result.week).toHaveLength(7);
      expect(result.week[1].day).toBe('Monday'); // index 1 = Monday
    });
  });

  describe('update', () => {
    it('should update a rule successfully', async () => {
      const updateDto = { startTime: '07:00' };
      const existingRule = { id: 1, dayOfWeek: 'Monday', startTime: '06:00', city: { id: 1 }, restrictedDigits: ['1'] };
      mockRuleRepo.findOne.mockResolvedValue(existingRule);
      mockRuleRepo.save.mockResolvedValue({ ...existingRule, ...updateDto });

      const result = await service.update(1, updateDto);
      expect(result.data.startTime).toBe('07:00');
    });

    it('should throw NotFoundException if rule not found', async () => {
      mockRuleRepo.findOne.mockResolvedValue(null);
      await expect(service.update(1, { startTime: '07:00' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a rule', async () => {
      const rule = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(rule as any);
      mockRuleRepo.remove.mockResolvedValue(undefined);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Rule deleted successfully.' });
    });
  });
});