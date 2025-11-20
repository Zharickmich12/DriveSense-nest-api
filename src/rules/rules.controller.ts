import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Rules')
@ApiBearerAuth()
@Controller('rules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  // ================= Create Rule =================
  @Post()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new rule' })
  @ApiResponse({ status: 201, description: 'Rule successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateRuleDto })
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.create(createRuleDto);
  }

  // ================= Check Circulation for a Day =================
  @Post('check')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: 'Check vehicle circulation for a day' })
  @ApiResponse({ status: 200, description: 'Returns circulation result for the day.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        plate: { type: 'string', example: 'ABC123' },
        cityId: { type: 'number', example: 1 },
        date: { type: 'string', format: 'date', example: '2025-11-19' },
      },
      required: ['plate', 'cityId', 'date'],
    },
  })
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

  // ================= Check Circulation for a Week =================
  @Post('week')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: 'Check vehicle circulation for a week' })
  @ApiResponse({ status: 200, description: 'Returns circulation results for the week.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        plate: { type: 'string', example: 'ABC123' },
        cityId: { type: 'number', example: 1 },
      },
      required: ['plate', 'cityId'],
    },
  })
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

  // ================= Get All Rules =================
  @Get()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Get all rules' })
  @ApiResponse({ status: 200, description: 'List of all rules.' })
  findAll() {
    return this.rulesService.findAll();
  }

  // ================= Get Rule by ID =================
  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Get a rule by ID' })
  @ApiResponse({ status: 200, description: 'Rule found.' })
  @ApiResponse({ status: 404, description: 'Rule not found.' })
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(+id);
  }

  // ================= Update Rule =================
  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Update a rule' })
  @ApiResponse({ status: 200, description: 'Rule successfully updated.' })
  @ApiResponse({ status: 404, description: 'Rule not found.' })
  @ApiBody({ type: UpdateRuleDto })
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.rulesService.update(+id, updateRuleDto);
  }

  // ================= Delete Rule =================
  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a rule' })
  @ApiResponse({ status: 200, description: 'Rule successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Rule not found.' })
  remove(@Param('id') id: string) {
    return this.rulesService.remove(+id);
  }
}