import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanesController } from './lanes.controller';
import { LanesService } from './lanes.service';
import { Lane } from './entities/lane.entity';
import { Card } from 'src/cards/entities/card.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [LanesController],
  providers: [LanesService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    TypeOrmModule.forFeature([Card, Lane]),
  ],
  exports: [LanesModule, LanesService],
})
export class LanesModule {}
