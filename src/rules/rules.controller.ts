import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from '../users/entities/user.entity';
import { CheckCirculationDto } from './dto/check-circulation.dto';
import { CheckWeekDto } from './dto/check-week.dto';

@Controller('rules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  // ==========================================================
  // CRUD BÁSICO
  // ==========================================================

  @Post()
  @Roles(RolesEnum.ADMIN)
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.create(createRuleDto);
  }



  @Get()
  @Roles(RolesEnum.ADMIN)
  findAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.rulesService.update(+id, updateRuleDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.rulesService.remove(+id);
  }

  // ==========================================================
  //  CONSULTA POR DÍA (POST /rules/check)
  // ==========================================================
@Post('check')
@Roles(RolesEnum.ADMIN, RolesEnum.USER)
checkRule(@Req() req, @Body() dto: CheckWeekDto) {
  const user = req.user;

  return this.rulesService.checkCirculation(
    dto.plate,
    dto.cityId,
    dto.date ?? new Date().toISOString(),
    user,
    false,
  );
}


@Post('week')
@Roles(RolesEnum.ADMIN, RolesEnum.USER)
checkByWeek(@Req() req, @Body() dto: CheckWeekDto) {
  const user = req.user;

return this.rulesService.checkCirculation(
    dto.plate,
    dto.cityId,
    dto.date ?? new Date().toISOString(),
    user,
    true,   // este sí debería ser TRUE para semana
);


}

}
