import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CommentsService } from 'src/comments/comments.service';
import { AuthModule } from 'src/auth/auth.module';
import { LanesModule } from '../lanes/lanes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsController } from './cards.controller';
import { Card } from './entities/card.entity';
import { Lane } from 'src/lanes/entities/lane.entity';
import { User } from 'src/auth/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [CardsController],
  providers: [CardsService, CommentsService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    LanesModule,
    TypeOrmModule.forFeature([Card, Comment, Lane, User]),
  ],
  exports: [CardsModule, CardsService],
})
export class CardsModule {}
