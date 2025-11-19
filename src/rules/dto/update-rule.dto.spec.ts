import { validate } from 'class-validator';
import { UpdateRuleDto } from './update-rule.dto';

describe('UpdateRuleDto Validation', () => {
  let dto: UpdateRuleDto;

  beforeEach(() => {
    dto = new UpdateRuleDto();
  });

  it('should be valid when no fields are provided (because PartialType)', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate successfully when valid fields are provided', async () => {
    dto.dayOfWeek = 'Monday';
    dto.startTime = '07:00';
    dto.endTime = '19:00';
    dto.restrictedDigits = ['1', '2'];
    dto.cityId = 2;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when startTime has invalid format', async () => {
    dto.startTime = '7:00';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when endTime has invalid format', async () => {
    dto.endTime = '25:99';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when restrictedDigits is not an array', async () => {
    // @ts-ignore
    dto.restrictedDigits = '12';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when cityId is not an integer', async () => {
    // @ts-ignore
    dto.cityId = 'ABC';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});