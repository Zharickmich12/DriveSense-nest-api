import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Log } from './entities/log.entity';
import { City } from '../city/entities/city.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { FilterLogDto } from './dto/filter-log.dto';

@Injectable()
export class LogsService {

  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(data: CreateLogDto) {
    let city: City | null = null;
    let vehicle: Vehicle | null = null;

    if (data.cityId) {
      city = await this.cityRepository.findOne({ where: { id: data.cityId } });
      if (!city) throw new NotFoundException(`City ${data.cityId} not found`);
    }

    if (data.vehicleId) {
      vehicle = await this.vehicleRepository.findOne({ where: { id: data.vehicleId } });
      if (!vehicle) throw new NotFoundException(`Vehicle ${data.vehicleId} not found`);
    }

    const { cityId, vehicleId, ...logData } = data;

    const logCreationData: any = {
      ...logData,
    };

    if (city) {
      logCreationData.city = city;
    }
    if (vehicle) {
      logCreationData.vehicle = vehicle;
    }

    const log = this.logRepository.create(logCreationData);

    return await this.logRepository.save(log);
  }

  async findAll(filters?: FilterLogDto) {
    const whereCondition: any = {};

    // Filtro por usuario
    if (filters?.user) {
      whereCondition.user = filters.user;
    }

    // Filtro por placa
    if (filters?.vehiclePlate) {
      whereCondition.vehiclePlate = filters.vehiclePlate;
    }

    // Filtro por ciudad
    if (filters?.cityId) {
      whereCondition.city = { id: filters.cityId };
    }

    // Filtro por vehículo
    if (filters?.vehicleId) {
      whereCondition.vehicle = { id: filters.vehicleId };
    }

    // Filtro por rango de fechas
    if (filters?.startDate && filters?.endDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);

      whereCondition.createdAt = Between(startDate, endDate);
    } else if (filters?.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      whereCondition.createdAt = Between(startDate, new Date());
    }

    const logs = await this.logRepository.find({
      where: whereCondition,
      relations: ['city', 'vehicle'],
      order: { createdAt: 'DESC' },
    });

    return {
      message: `Total logs found: ${logs.length}`,
      data: logs,
    };
  }

  // Método adicional para estadísticas
  async getStats(cityId?: number) {
    const whereCondition: any = {};
    
    if (cityId) {
      whereCondition.city = { id: cityId };
    }

    const logs = await this.logRepository.find({
      where: whereCondition,
      relations: ['city', 'vehicle'],
    });

    const stats = {
      total: logs.length,
      byEndpoint: {} as Record<string, number>,
      byUser: {} as Record<string, number>,
      successfulQueries: 0,
      errorQueries: 0,
    };

    logs.forEach(log => {
      // Contar por endpoint
      if (log.endpoint) {
        stats.byEndpoint[log.endpoint] = (stats.byEndpoint[log.endpoint] || 0) + 1;
      }

      // Contar por usuario
      if (log.user) {
        stats.byUser[log.user] = (stats.byUser[log.user] || 0) + 1;
      }

      // Contar éxitos y errores
      if (log.result && log.result.includes('SUCCESS')) {
        stats.successfulQueries++;
      } else if (log.result && log.result.includes('ERROR')) {
        stats.errorQueries++;
      }
    });

    return stats;
  }
}