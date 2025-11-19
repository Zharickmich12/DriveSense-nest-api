import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(strategy).toBeDefined();
    });

    it('should configure JWT options correctly', () => {
      const jwtSecret = 'test-secret';
      mockConfigService.get.mockReturnValue(jwtSecret);

      // Re-instantiate to test constructor
      const newStrategy = new JwtStrategy(configService);

      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET_KEY');
    });
  });

  describe('validate', () => {
    it('should return user data from JWT payload', async () => {
      const payload = {
        sub: 1,
        email: 'test@example.com',
        role: 'user'
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        role: payload.role
      });
    });

    it('should handle different payload structures', async () => {
      const payload = {
        sub: 2,
        email: 'admin@example.com',
        role: 'admin',
        extraField: 'should-be-ignored'
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        role: payload.role
      });
      expect((result as any).extraField).toBeUndefined();
    });
  });
});
