import { Test, TestingModule } from '@nestjs/testing';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { BadRequestException } from '@nestjs/common';

describe('RulesController', () => {
  let controller: RulesController;
  let service: RulesService;

  const mockRulesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkCirculation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RulesController],
      providers: [
        {
          provide: RulesService,
          useValue: mockRulesService,
        },
      ],
    }).compile();

    controller = module.get<RulesController>(RulesController);
    service = module.get<RulesService>(RulesService);
  });

  // --------------------------------------------------------
  // CREATE
  // --------------------------------------------------------
  it('should create a rule', async () => {
    const dto: CreateRuleDto = {
      dayOfWeek: 'Lunes',
      startTime: '06:00',
      endTime: '09:00',
      restrictedDigits: ['1', '2'],
      cityId: 1,
    };

    const result = { message: 'Rule created successfully.' };
    mockRulesService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toBe(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  // --------------------------------------------------------
  // CHECK RULE (POST /rules/check)
  // --------------------------------------------------------
  it('should validate and call checkRule', async () => {
    const body = { plate: 'ABC123', cityId: 1, date: '2025-11-12T14:00:00' };
    const result = { canCirculate: true };

    mockRulesService.checkCirculation.mockResolvedValue(result);

    expect(await controller.checkRule(body)).toBe(result);
  });

  it('should throw BadRequestException in checkRule with missing fields', () => {
    expect(() => controller.checkRule({ plate: 'ABC123' } as any)).toThrow(
      BadRequestException,
    );
  });

  // --------------------------------------------------------
  // FIND ALL
  // --------------------------------------------------------
  it('should return all rules', async () => {
    const result = { data: [] };
    mockRulesService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
  });

  // --------------------------------------------------------
  // FIND ONE
  // --------------------------------------------------------
  it('should return one rule', async () => {
    const result = { id: 1 };
    mockRulesService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toBe(result);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  // --------------------------------------------------------
  // UPDATE
  // --------------------------------------------------------
  it('should update a rule', async () => {
    const dto: UpdateRuleDto = { dayOfWeek: 'Martes' };
    const result = { message: 'Rule updated successfully.' };

    mockRulesService.update.mockResolvedValue(result);

    expect(await controller.update('1', dto)).toBe(result);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  // --------------------------------------------------------
  // REMOVE
  // --------------------------------------------------------
  it('should delete a rule', async () => {
    const result = { message: 'Rule deleted successfully.' };
    mockRulesService.remove.mockResolvedValue(result);

    expect(await controller.remove('1')).toBe(result);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  // --------------------------------------------------------
  // CHECK /DAY
  // --------------------------------------------------------
  it('should validate and call checkByDay', async () => {
    const body = {
      plate: 'ABC123',
      cityId: 1,
      date: '2025-11-14T07:00:00',
    };

    const result = { canCirculate: true };
    mockRulesService.checkCirculation.mockResolvedValue(result);

    expect(await controller.checkByDay(body)).toBe(result);
  });

  it('should throw BadRequestException on /rules/day missing fields', () => {
    expect(() => controller.checkByDay({ plate: 'ABC123' } as any)).toThrow(
      BadRequestException,
    );
  });

  // --------------------------------------------------------
  // CHECK /WEEK
  // --------------------------------------------------------
  it('should validate and call checkByWeek', async () => {
    const body = { plate: 'ABC123', cityId: 1 };
    const result = { week: [] };

    mockRulesService.checkCirculation.mockResolvedValue(result);

    expect(await controller.checkByWeek(body)).toBe(result);
  });

  it('should throw BadRequestException on /rules/week missing fields', () => {
    expect(() => controller.checkByWeek({ plate: 'ABC123' } as any)).toThrow(
      BadRequestException,
    );
  });
});