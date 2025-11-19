import { validate } from 'class-validator';
import { FilterLogDto } from './filter-log.dto';

describe('FilterLogDto', () => {
  it('should be valid with all correct fields', async () => {
    const dto = new FilterLogDto();
    dto.user = 'John Doe';
    dto.vehiclePlate = 'ABC123';
    dto.cityId = 1;
    dto.startDate = '2025-11-19';
    dto.endDate = '2025-11-20';
    dto.vehicleId = 2;

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No validation errors
  });

  it('should be valid even if optional fields are missing', async () => {
    const dto = new FilterLogDto(); // All optional
    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Still valid
  });

  it('should fail if cityId or vehicleId are not integers', async () => {
    const dto = new FilterLogDto();
    dto.cityId = 'not-a-number' as any;
    dto.vehicleId = 1.5; // decimal instead of int

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const cityIdError = errors.find(e => e.property === 'cityId');
    const vehicleIdError = errors.find(e => e.property === 'vehicleId');
    expect(cityIdError).toBeDefined();
    expect(vehicleIdError).toBeDefined();
  });

  it('should fail if string fields are not strings', async () => {
    const dto = new FilterLogDto();
    dto.user = 123 as any;
    dto.vehiclePlate = {} as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const userError = errors.find(e => e.property === 'user');
    const vehiclePlateError = errors.find(e => e.property === 'vehiclePlate');
    expect(userError).toBeDefined();
    expect(vehiclePlateError).toBeDefined();
  });

  it('should accept startDate and endDate as strings', async () => {
    const dto = new FilterLogDto();
    dto.startDate = '2025-11-01';
    dto.endDate = '2025-11-30';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Strings are allowed
  });
});