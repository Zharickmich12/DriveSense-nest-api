import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule} from './entities/rule.entity';
import { City } from 'src/city/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rule, City])],
  controllers: [RulesController],
  providers: [RulesService],
})
export class RulesModule {}
