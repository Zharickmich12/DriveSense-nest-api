import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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

  @Post('check')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: 'Check circulation for a day' })
  @ApiResponse({ status: 200, description: 'Returns circulation result.' })
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
  @ApiOperation({ summary: 'Check circulation for a week' })
  @ApiResponse({ status: 200, description: 'Returns circulation results for the week.' })
  checkByWeek(@Req() req, @Body() dto: CheckWeekDto) {
    const user = req.user;
    return this.rulesService.checkCirculation(
      dto.plate,
      dto.cityId,
      dto.date ?? new Date().toISOString(),
      user,
      true,
    );
  }
}