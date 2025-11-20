import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req , BadRequestException, Request} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from '../users/entities/user.entity';
import { CheckWeekDto } from './dto/check-week.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Rules')
@ApiBearerAuth()
@Controller('rules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new rule' })
  @ApiResponse({ status: 201, description: 'Rule successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.create(createRuleDto);
  }

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

    const userEmail = req.user?.email || 'anonymous';

    return this.rulesService.checkCirculation(
      plate,
      Number(cityId),
      date,
      false,
      userEmail,
    );
  }

  @Get()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Get all rules' })
  @ApiResponse({ status: 200, description: 'List of rules.' })
  findAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Get a rule by ID' })
  @ApiResponse({ status: 200, description: 'Rule found.' })
  @ApiResponse({ status: 404, description: 'Rule not found.' })
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Update a rule' })
  @ApiResponse({ status: 200, description: 'Rule successfully updated.' })
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.rulesService.update(+id, updateRuleDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a rule' })
  @ApiResponse({ status: 200, description: 'Rule successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.rulesService.remove(+id);
  }

  @Post('day')
  async checkByDay(@Body() body: any, @Request() req: any) {
    const { plate, cityId, date } = body;

    if (!plate || !cityId || !date) {
      throw new BadRequestException({
        es: 'Debes enviar plate, cityId y date.',
        en: 'You must provide plate, cityId and date.',
      });
    }

    const userEmail = req.user?.email || 'anonymous';

    return this.rulesService.checkCirculation(
      plate,
      Number(cityId),
      date,
      false, // fullWeek = false
      userEmail,
    );
  }

  @Post('week')
  async checkByWeek(@Body() body: any, @Request() req: any) {
    const { plate, cityId } = body;

    if (!plate || !cityId) {
      throw new BadRequestException({
        es: 'Debes enviar plate y cityId.',
        en: 'You must provide plate and cityId.',
      });
    }

    const userEmail = req.user?.email || 'anonymous';

    return this.rulesService.checkCirculation(
      plate,
      Number(cityId),
      '',
      true, // fullWeek = true
      userEmail,
    );
  }
}