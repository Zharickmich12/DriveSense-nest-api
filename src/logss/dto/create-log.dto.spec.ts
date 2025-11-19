import { validate } from 'class-validator';
import { CreateLogDto } from './create-log.dto';

describe('CreateLogDto', () => {
  it('should be valid with all correct fields', async () => {
    const dto = new CreateLogDto();
    dto.user = 'John Doe';
    dto.method = 'POST';
    dto.endpoint = '/rules';
    dto.body = '{"dayOfWeek":"Monday"}';
    dto.vehiclePlate = 'ABC123';
    dto.result = 'Success';
    dto.cityId = 1;
    dto.vehicleId = 2;

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No validation errors
  });

  it('should be valid even if optional fields are missing', async () => {
    const dto = new CreateLogDto(); // All optional
    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Still valid
  });

  it('should fail if cityId or vehicleId are not integers', async () => {
    const dto = new CreateLogDto();
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
    const dto = new CreateLogDto();
    dto.user = 123 as any;
    dto.method = {} as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const userError = errors.find(e => e.property === 'user');
    const methodError = errors.find(e => e.property === 'method');
    expect(userError).toBeDefined();
    expect(methodError).toBeDefined();
  });
});