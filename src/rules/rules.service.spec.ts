import { Test, TestingModule } from '@nestjs/testing';
import { RulesService } from './rules.service';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
});

describe('RulesService', () => {
  let service: RulesService;
  let ruleRepository;
  let cityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RulesService,
        { provide: 'RuleRepository', useValue: mockRepository() },
        { provide: 'CityRepository', useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<RulesService>(RulesService);
    ruleRepository = module.get('RuleRepository');
    cityRepository = module.get('CityRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rule successfully', async () => {
      const createDto = {
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '10:00',
        restrictedDigits: ['1', '2'],
        cityId: 1,
      };

      cityRepository.findOneBy.mockResolvedValue({ id: 1, name: 'Test City' });
      ruleRepository.create.mockReturnValue({ ...createDto, city: { id: 1 } });
      ruleRepository.save.mockResolvedValue({ id: 1, ...createDto, city: { id: 1 } });

      const result = await service.create(createDto);

      expect(result).toEqual({
        message: 'Rule created successfully.',
        data: { id: 1, ...createDto, city: { id: 1 } },
      });
    });

    it('should throw NotFoundException if city not found', async () => {
      cityRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({
          dayOfWeek: 'Monday',
          startTime: '08:00',
          endTime: '10:00',
          restrictedDigits: ['1', '2'],
          cityId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all rules', async () => {
      ruleRepository.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const result = await service.findAll();
      expect(result).toEqual({
        message: 'Total registered rules: 2',
        data: [{ id: 1 }, { id: 2 }],
      });
    });
  });

  describe('findOne', () => {
    it('should return a rule by id', async () => {
      ruleRepository.findOne.mockResolvedValue({ id: 1 });
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if rule not found', async () => {
      ruleRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});