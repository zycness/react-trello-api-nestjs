import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Lane } from 'src/lanes/entities/lane.entity';
import { LanesService } from 'src/lanes/lanes.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CommentsService } from 'src/comments/comments.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, LanesService, CommentsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Card, Comment, Lane, User]),
  ],
  exports: [CardsModule],
})
export class CardsModule {}
