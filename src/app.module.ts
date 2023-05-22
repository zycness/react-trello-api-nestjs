import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanesModule } from './lanes/lanes.module';
import { CardsModule } from './cards/cards.module';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';

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
      autoLoadEntities: true,
      // synchronize: true, (deleted for production)
    }),
    LanesModule,
    CardsModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
