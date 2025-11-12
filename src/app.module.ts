import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CityModule } from './city/city.module';
import { RulesModule } from './rules/rules.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AuthModule, UsersModule, CityModule, RulesModule, VehiclesModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
