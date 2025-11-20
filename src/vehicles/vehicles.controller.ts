import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RolesEnum } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Vehicle } from './entities/vehicle.entity';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(RolesEnum.USER, RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully', type: Vehicle })
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    return this.vehiclesService.create(createVehicleDto, req.user);
  }

  @Get()
  @Roles(RolesEnum.USER, RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Get all vehicles for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of vehicles', type: [Vehicle] })
  findAll(@Request() req) {
    return this.vehiclesService.findAll(req.user);
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle found', type: Vehicle })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: 'Update a vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle updated', type: Vehicle })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVehicleDto: UpdateVehicleDto, @Request() req) {
    return this.vehiclesService.update(id, updateVehicleDto, req.user);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: 'Delete a vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.remove(id, req.user);
  }
}