import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanesModule } from './lanes/lanes.module';
import { CardsModule } from './cards/cards.module';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import { Card } from './cards/entities/card.entity';
import { Lane } from './lanes/entities/lane.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Card, Lane, User, Comment],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CardsModule,
    LanesModule,
    CommentsModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
