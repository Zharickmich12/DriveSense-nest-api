import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Cities')
@ApiBearerAuth()
@Controller('city')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({ status: 201, description: 'City successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can create cities' })
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'List of all cities returned' })
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiResponse({ status: 200, description: 'City found and returned' })
  @ApiResponse({ status: 404, description: 'City not found' })
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Update a city by ID' })
  @ApiResponse({ status: 200, description: 'City successfully updated' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can update cities' })
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a city by ID' })
  @ApiResponse({ status: 200, description: 'City successfully deleted' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can delete cities' })
  remove(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}