import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Lane } from 'src/lanes/entities/lane.entity';
import { LanesService } from 'src/lanes/lanes.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';
import { CardComment } from './entities/card-comment.entity';

@Module({
  controllers: [CardsController],
  providers: [CardsService, LanesService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Card, Lane, User, CardComment]),
  ],
  exports: [CardsModule],
})
export class CardsModule {}
