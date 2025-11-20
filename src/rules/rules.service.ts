import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { City } from '../city/entities/city.entity';
import { Repository } from 'typeorm';
import { LogsService } from '../logss/logs.service';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Injectable()
export class RulesService {

   constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly logsService: LogsService
  ) {}

  async create(createRuleDto: CreateRuleDto) {
    const { cityId, dayOfWeek,...data } = createRuleDto;
    const city = await this.cityRepository.findOneBy({ id: cityId });

    if (!city) throw new NotFoundException(`The city with id ${cityId} was not found. `);

    const existingRule = await this.ruleRepository.findOne({
      where: {
        city: { id: cityId },
        dayOfWeek: dayOfWeek,
      },
      relations: ['city'],
    });

    if (existingRule) {
      throw new BadRequestException(
        `Ya existe una regla para el día ${dayOfWeek} en esta ciudad.`,
      );
    }


    const rule = this.ruleRepository.create({ ...data,dayOfWeek, city });
    await this.ruleRepository.save(rule);

    return {
      message: 'Rule created successfully.',
      data: rule,
    };
  }

  async findAll() {
    const rules = await this.ruleRepository.find({ relations: ['city'] });
    return {
      message: `Total registered rules: ${rules.length}`,
      data: rules,
    };
  }

  async findOne(id: number) {
    const rule = await this.ruleRepository.findOne({
      where: { id },
      relations: ['city'],
    });
    if (!rule) throw new NotFoundException(`The rule with id ${id} was not found.`);
    return rule;
  }

  async update(id: number, updateRuleDto: UpdateRuleDto) {
    const rule = await this.ruleRepository.findOne({ where: { id },
      relations: ['city'],});
    if (!rule) throw new NotFoundException(`The rule with id ${id} was not found.`);

    Object.assign(rule, updateRuleDto);
    await this.ruleRepository.save(rule);

    return {
      message: 'Rule updated successfully.',
      data: rule,
    };
  }

  async remove(id: number) {
    const rule = await this.findOne(id);
    await this.ruleRepository.remove(rule);
    return { message: 'Rule deleted successfully.' };
  }

  async checkCirculation(
    plate: string,
    cityId: number,
    date?: string,
    fullWeek: boolean = false,
    user?: string,
  ) {

    const plateRegex = /^[A-Za-z]{3}[0-9]{3}$/;

    if (!plateRegex.test(plate)) {
      const errorResult = {
        canCirculate: false,
        message: {
          es: `La placa "${plate}" no es válida o no existe en el sistema (formato esperado: ABC123).`,
          en: `The plate "${plate}" is not valid or does not exist in the system (expected format: ABC123).`,
        },
      };

      await this.logsService.create({
        user: user || 'anonymous',
        method: 'POST',
        endpoint: '/rules/check',
        body: JSON.stringify({ plate, cityId, date, fullWeek }),
        vehiclePlate: plate,
        result: 'ERROR: Invalid plate format',
        cityId: cityId,
      });

      return errorResult;
    }

    const lastDigit = plate.slice(-1);

    const city = await this.cityRepository.findOne({ where: { id: cityId } });

    if (!city) {

      await this.logsService.create({
        user: user || 'anonymous',
        method: 'POST',
        endpoint: '/rules/check',
        body: JSON.stringify({ plate, cityId, date, fullWeek }),
        vehiclePlate: plate,
        result: `ERROR: City ${cityId} not found`,
        cityId: cityId,
      });

      throw new NotFoundException({
        es: `La ciudad con ID ${cityId} no existe.`,
        en: `City with ID ${cityId} does not exist.`,
      });
    }

    const vehicle = await this.vehicleRepository.findOne({
      where: { licensePlate: plate.toUpperCase() },
    });

    const rules = await this.ruleRepository.find({
      where: { city: { id: cityId }, isActive: true },
    });

    if (rules.length === 0) {
      const result = {
        canCirculate: true,
        message: {
          es: `Esta ciudad no tiene reglas activas. Puedes circular libremente.`,
          en: `This city has no active rules. You may circulate freely.`,
        },
      };

      await this.logsService.create({
        user: user || 'anonymous',
        method: 'POST',
        endpoint: '/rules/check',
        body: JSON.stringify({ plate, cityId, date, fullWeek }),
        vehiclePlate: plate,
        result: 'SUCCESS: No active rules, can circulate',
        cityId: city.id,
        vehicleId: vehicle?.id,
      });

      return result;
    }

    if (fullWeek) {
      const result = this.evaluateFullWeek(lastDigit, rules);

      await this.logsService.create({
        user: user || 'anonymous',
        method: 'POST',
        endpoint: '/rules/week',
        body: JSON.stringify({ plate, cityId, fullWeek }),
        vehiclePlate: plate,
        result: JSON.stringify(result),
        cityId: city.id,
        vehicleId: vehicle?.id,
      });

      return result;
    }

    if (!date) {
      await this.logsService.create({
        user: user || 'anonymous',
        method: 'POST',
        endpoint: '/rules/check',
        body: JSON.stringify({ plate, cityId, date, fullWeek }),
        vehiclePlate: plate,
        result: 'ERROR: No date provided',
        cityId: city.id,
        vehicleId: vehicle?.id,
      });

      throw new BadRequestException({
        es: 'Debes enviar una fecha válida.',
        en: 'You must provide a valid date.',
      });
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      await this.logsService.create({
        user: user || 'anonymous',
        method: 'POST',
        endpoint: '/rules/check',
        body: JSON.stringify({ plate, cityId, date, fullWeek }),
        vehiclePlate: plate,
        result: 'ERROR: Invalid date format',
        cityId: city.id,
        vehicleId: vehicle?.id,
      });

      throw new BadRequestException({
        es: 'Formato de fecha inválido.',
        en: 'Invalid date format.',
      });
    }

    const result = this.evaluateSingleDay(lastDigit, selectedDate, rules);

    await this.logsService.create({
      user: user || 'anonymous',
      method: 'POST',
      endpoint: '/rules/day',
      body: JSON.stringify({ plate, cityId, date }),
      vehiclePlate: plate,
      result: JSON.stringify({
        canCirculate: result.canCirculate,
        message: result.message.es,
      }),
      cityId: city.id,
      vehicleId: vehicle?.id,
    });

    return result;
  }

  private evaluateSingleDay(lastDigit: string, date: Date, rules: Rule[]) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
    const dayText = dayNames[date.getDay()];

    const currentHour = date.getHours();
    const currentMinutes = date.getMinutes();
    const now = Number(`${currentHour}${currentMinutes.toString().padStart(2, '0')}`);

    const dayRules = rules.filter(r => r.dayOfWeek === dayText);

    if (!dayRules.length) {
      return {
        canCirculate: true,
        message: {
          es: `No hay restricciones el día ${dayText}.`,
          en: `There are no restrictions on ${dayText}.`,
        },
      };
    }

    for (const rule of dayRules) {
      const start = Number(rule.startTime.replace(':', ''));
      const end = Number(rule.endTime.replace(':', ''));

      const digitRestricted = rule.restrictedDigits.includes(lastDigit);
      const timeRestricted = now >= start && now <= end;

      if (digitRestricted && timeRestricted) {
        return {
          canCirculate: false,
          message: {
            es: `NO puedes circular entre las ${rule.startTime} y ${rule.endTime}. Dígitos restringidos: ${rule.restrictedDigits.join(', ')}.`,
            en: `You CANNOT circulate between ${rule.startTime} and ${rule.endTime}. Restricted digits: ${rule.restrictedDigits.join(', ')}.`,
          },
        };
      }
    }

    return {
      canCirculate: true,
      message: {
        es: 'Puedes circular en esta fecha y hora.',
        en: 'You are allowed to circulate at this date and time.',
      },
    };
  }

  private evaluateFullWeek(lastDigit: string, rules: Rule[]) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

    const week: Array<{
      day: string;
      canCirculate: boolean;
      message: { es: string; en: string };
    }> = [];

    for (const day of dayNames) {
      const dayRules = rules.filter(r => r.dayOfWeek === day);

      if (!dayRules.length) {
        week.push({
          day,
          canCirculate: true,
          message: {
            es: `No hay restricciones el día ${day}.`,
            en: `There are no restrictions on ${day}.`,
          },
        });
        continue;
      }

      const restriction = dayRules.find(r =>
        r.restrictedDigits.includes(lastDigit),
      );

      if (!restriction) {
        week.push({
          day,
          canCirculate: true,
          message: {
            es: `Tu placa no está restringida el día ${day}.`,
            en: `Your plate is NOT restricted on ${day}.`,
          },
        });
      } else {
        week.push({
          day,
          canCirculate: false,
          message: {
            es: `NO puedes circular de ${restriction.startTime} a ${restriction.endTime}. Dígitos: ${restriction.restrictedDigits.join(', ')}.`,
            en: `You CANNOT circulate from ${restriction.startTime} to ${restriction.endTime}. Digits: ${restriction.restrictedDigits.join(', ')}.`,
          },
        });
      }
    }

    return { week };
  }
}