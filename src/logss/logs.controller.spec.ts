import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { FilterLogDto } from './dto/filter-log.dto';

describe('LogsController', () => {
  let controller: LogsController;
  let service: LogsService;

  const mockLogsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        {
          provide: LogsService,
          useValue: mockLogsService,
        },
      ],
    }).compile();

    controller = module.get<LogsController>(LogsController);
    service = module.get<LogsService>(LogsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateLogDto = {
        user: 'John Doe',
        method: 'POST',
        endpoint: '/logs',
        vehiclePlate: 'ABC123',
      };

      const result = { message: 'Log created', data: dto };
      mockLogsService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockLogsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with filters and return result', async () => {
      const filters: FilterLogDto = { user: 'John Doe', cityId: 1 };
      const result = [{ id: 1, user: 'John Doe' }];

      mockLogsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(filters)).toEqual(result);
      expect(mockLogsService.findAll).toHaveBeenCalledWith(filters);
    });

    it('should handle empty filters', async () => {
      const filters: FilterLogDto = {};
      const result = [];

      mockLogsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(filters)).toEqual(result);
      expect(mockLogsService.findAll).toHaveBeenCalledWith(filters);
    });
  });
});