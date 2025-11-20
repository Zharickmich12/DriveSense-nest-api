import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    const whereCondition = {};

    if (filters && filters.user) {
        whereCondition['user'] = filters.user;
    }

    if (filters && filters.vehicleId) {
        whereCondition['vehicle'] = { id: filters.vehicleId };
    }

    return this.logRepository.find({
        where: whereCondition, 
        relations: ['city', 'vehicle'],
        order: { createdAt: 'DESC' },
    });
}

}
