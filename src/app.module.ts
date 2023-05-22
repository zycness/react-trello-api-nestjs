import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanesModule } from './lanes/lanes.module';
import { CardsModule } from './cards/cards.module';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import { Card } from './cards/entities/card.entity';
import { Lane } from './lanes/entities/lane.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [Card, Lane],
      synchronize: true,
    }),
    LanesModule,
    CardsModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
