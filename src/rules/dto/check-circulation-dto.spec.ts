import { validate } from 'class-validator';
import { CheckCirculationDto } from './check-circulation.dto';

describe('CheckCirculationDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CheckCirculationDto();
    dto.plate = 'ABC123';
    dto.cityId = 1;
    dto.date = '2025-11-19';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if plate is invalid', async () => {
    const dto = new CheckCirculationDto();
    dto.plate = 'AB1234';
    dto.cityId = 1;
    dto.date = '2025-11-19';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      'matches',
      'La placa debe tener 3 letras seguidas de 3 números',
    );
  });

  it('should fail if plate is empty', async () => {
    const dto = new CheckCirculationDto();
    dto.plate = '';
    dto.cityId = 1;
    dto.date = '2025-11-19';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if cityId is not a number', async () => {
    const dto = new CheckCirculationDto();
    dto.plate = 'ABC123';
    // @ts-ignore
    dto.cityId = 'not-a-number';
    dto.date = '2025-11-19';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should fail if date is empty', async () => {
    const dto = new CheckCirculationDto();
    dto.plate = 'ABC123';
    dto.cityId = 1;
    dto.date = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});