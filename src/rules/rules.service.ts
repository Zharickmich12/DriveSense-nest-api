import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { City } from 'src/city/entities/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RulesService {

   constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(createRuleDto: CreateRuleDto) {
    const { cityId, ...data } = createRuleDto;
    const city = await this.cityRepository.findOneBy({ id: cityId });

    if (!city) throw new NotFoundException(`The city with id ${cityId} was not found. `);

    const rule = this.ruleRepository.create({ ...data, city });
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
    const rule = await this.ruleRepository.findOne({ where: { id } });
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

}
