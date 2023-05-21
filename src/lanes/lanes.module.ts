import { Module } from '@nestjs/common';
import { LanesService } from './lanes.service';
import { LanesController } from './lanes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lane } from './entities/lane.entity';
import { Card } from 'src/cards/entities/card.entity';

@Module({
  controllers: [LanesController],
  providers: [LanesService],
  imports: [TypeOrmModule.forFeature([Card, Lane])],
  exports: [LanesModule, LanesService],
})
export class LanesModule {}
