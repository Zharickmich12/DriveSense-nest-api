import { validate } from 'class-validator';
import { CheckWeekDto } from './check-week.dto';

describe('CheckWeekDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CheckWeekDto();
    dto.plate = 'ABC123';
    dto.cityId = 1;
    dto.date = '2025-11-20';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if plate is empty', async () => {
    const dto = new CheckWeekDto();
    dto.plate = '';
    dto.cityId = 1;
    dto.date = '2025-11-20';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('plate');
  });

  it('should fail if cityId is not a number', async () => {
    const dto: any = new CheckWeekDto();
    dto.plate = 'ABC123';
    dto.cityId = 'not-a-number';
    dto.date = '2025-11-20';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('cityId');
  });

  it('should pass if date is omitted (optional)', async () => {
    const dto = new CheckWeekDto();
    dto.plate = 'ABC123';
    dto.cityId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});