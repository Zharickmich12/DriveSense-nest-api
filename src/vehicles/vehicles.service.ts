import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { RolesEnum, User } from 'src/users/entities/user.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>
  ) {}

  async create(data: CreateVehicleDto, user: User) {
    const existingVehicle = await this.vehicleRepo.findOne({
      where: { licensePlate: data.licensePlate },
    });

    if (existingVehicle) {
      throw new ConflictException('Vehicle with this license plate already exists');
    }

    const vehicle = this.vehicleRepo.create({
      ...data,
      user, // asocia el vehículo al usuario actual
    });

    return await this.vehicleRepo.save(vehicle);
  }

  async findAll(user: User) {
    let vehicles: Vehicle[];

    if (user.role === RolesEnum.ADMIN) {
      vehicles = await this.vehicleRepo.find({ relations: ['user'] });
    } else {
      vehicles = await this.vehicleRepo.find({
        where: { user: { id: user.id } },
        relations: ['user'],
      });
    }

    return vehicles.map(v => ({
      id: v.id,
      licensePlate: v.licensePlate,
      brand: v.brand,
      model: v.model,
      year: v.year,
      type: v.type,
      user: {
        id: v.user.id,
        name: v.user.name,
        email: v.user.email,
        role: v.user.role,
      },
    }));
  }

  // Devuelve la entidad completa para poder usarla en update/remove
  private async findVehicleEntity(id: number, user: User): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: user.role === RolesEnum.ADMIN ? { id } : { id, user: { id: user.id } },
      relations: ['user'],
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async findOne(id: number, user: User) {
    const vehicle = await this.findVehicleEntity(id, user);

    return {
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      user: {
        id: vehicle.user.id,
        name: vehicle.user.name,
        email: vehicle.user.email,
        role: vehicle.user.role,
      },
    };
  }

async update(id: number, data: UpdateVehicleDto, user: User) {
  const vehicle = await this.vehicleRepo.findOne({
    where: user.role === RolesEnum.ADMIN ? { id } : { id, user: { id: user.id } },
    relations: ['user'],
  });

  if (!vehicle) {
    throw new NotFoundException('Vehicle not found or you do not have permission to update it.');
  }

  // Validar si la nueva placa ya existe en otro vehículo
  if (data.licensePlate && data.licensePlate !== vehicle.licensePlate) {
    const existingVehicle = await this.vehicleRepo.findOne({ where: { licensePlate: data.licensePlate } });
    if (existingVehicle) {
      throw new ConflictException('A vehicle with this license plate already exists.');
    }
  }

  // Actualizar solo campos permitidos
  Object.assign(vehicle, data);

  const updated = await this.vehicleRepo.save(vehicle);

  // Ocultar datos sensibles
  return {
    id: updated.id,
    licensePlate: updated.licensePlate,
    brand: updated.brand,
    model: updated.model,
    year: updated.year,
    type: updated.type,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    user: {
      id: updated.user.id,
      name: updated.user.name,
      email: updated.user.email,
      role: updated.user.role,
    },
  };
}


 async remove(id: number, user: User) {
  // Buscar el vehículo
  const vehicle = await this.vehicleRepo.findOne({
    where: { id },
    relations: ['user'],
  });

  // Si no existe realmente
  if (!vehicle) {
    throw new NotFoundException('Vehicle not found.');
  }

  // Validar permisos:
  // - Admin puede eliminar todo
  // - Usuario solo puede eliminar sus propios vehículos
  if (user.role !== RolesEnum.ADMIN && vehicle.user.id !== user.id) {
    throw new ForbiddenException('You do not have permission to delete this vehicle.');
  }

  await this.vehicleRepo.remove(vehicle);

  // Respuesta limpia SIN datos sensibles
  return {
    success: true,
    message: 'Vehicle deleted successfully.',
    vehicle: {
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
    },
  };
}

}
