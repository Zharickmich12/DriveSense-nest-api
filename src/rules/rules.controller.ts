import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from '../users/entities/user.entity';

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

  // ==========================================================
  // 🔵 ENDPOINT PRINCIPAL DE CONSULTA CON LOGS
  // ==========================================================
  @Post('check')
  checkRule(
    @Body() data: { plate: string; cityId: number; date: string },
    @Request() req: any,
  ) {
    const { plate, cityId, date } = data;

    if (!plate || !cityId || !date) {
      throw new BadRequestException({
        es: 'Debes enviar plate, cityId y date.',
        en: 'You must provide plate, cityId and date.',
      });
    }

    // Obtener el email del usuario autenticado
    const userEmail = req.user?.email || 'anonymous';

    return this.rulesService.checkCirculation(
      plate,
      Number(cityId),
      date,
      false,
      userEmail, // Pasar el usuario al servicio
    );
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
  // 🔵 CONSULTA POR DÍA (POST /rules/day)
  // ==========================================================
  @Post('day')
  async checkByDay(@Body() body: any, @Request() req: any) {
    const { plate, cityId, date } = body;

    // Validaciones
    if (!plate || !cityId || !date) {
      throw new BadRequestException({
        es: 'Debes enviar plate, cityId y date.',
        en: 'You must provide plate, cityId and date.',
      });
    }

    const userEmail = req.user?.email || 'anonymous';

    // Consultar por un día específico
    return this.rulesService.checkCirculation(
      plate,
      Number(cityId),
      date,
      false, // fullWeek = false
      userEmail,
    );
  }

  // ==========================================================
  // 🔵 CONSULTA SEMANAL (POST /rules/week)
  // ==========================================================
  @Post('week')
  async checkByWeek(@Body() body: any, @Request() req: any) {
    const { plate, cityId } = body;

    // Validaciones
    if (!plate || !cityId) {
      throw new BadRequestException({
        es: 'Debes enviar plate y cityId.',
        en: 'You must provide plate and cityId.',
      });
    }

    const userEmail = req.user?.email || 'anonymous';

    // Consultar semana completa
    return this.rulesService.checkCirculation(
      plate,
      Number(cityId),
      undefined,
      true, // fullWeek = true
      userEmail,
    );
  }
}