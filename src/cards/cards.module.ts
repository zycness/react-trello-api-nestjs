import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Lane } from 'src/lanes/entities/lane.entity';
import { LanesService } from 'src/lanes/lanes.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, LanesService],
  imports: [TypeOrmModule.forFeature([Card, Lane])],
  exports: [CardsModule],
})
export class CardsModule {}
