import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Equal, QueryResult, Repository } from 'typeorm';
import { LanesService } from 'src/lanes/lanes.service';
import { User } from 'src/auth/entities/user.entity';
import { CommentsService } from 'src/comments/comments.service';
import { query } from 'express';
import { Comment } from 'src/comments/entities/comment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly laneServices: LanesService,
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createCardDto: CreateCardDto, user: User) {
    try {
      const lane = await this.laneServices.findOne(createCardDto.lane);
      const card = this.cardRepository.create({ ...createCardDto, lane, user });
      await this.cardRepository.save(card);
      this.eventEmitter.emit('new-card', card);
      return card.getPlain();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const cards = await this.cardRepository.find({
      relations: {
        user: true,
      },
    });

    if (!cards) {
      console.log('1');
      return [];
    }

    let arr = [];

    cards.forEach(async (card) => {
      console.log(card);
      let plainCardObj = await this.plainCard(card);
      arr.push(plainCardObj);
    });

    console.log('2');
    return arr;
  }

  async findOnePlain(id: string) {
    return await this.plainCard(await this.findOne(id));
  }

  async getCardComments(id: string) {
    return [];
  }

  async findOne(id: string) {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) throw new NotFoundException(`Card with id ${id} not found`);
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userId: string) {
    let { lane, ...toUpdate } = updateCardDto;

    await this.findOwnOne(id, userId);

    const card = await this.cardRepository.preload({
      id,
      ...toUpdate,
    });
    try {
      if (lane) {
        card.lane = await this.laneServices.findOne(lane);
      }
      return await this.cardRepository.save(card);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, userId: string) {
    let { card } = await this.findOwnOne(id, userId);

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.delete(Card, card);
      await queryRunner.manager.delete(Comment, { cardId: card.id });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        message: 'Cards and comments deleted successfuly',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return this.handleDBExceptions(error);
    }
  }

  async plainCard(card: Card) {
    const { created_by, updated_by, updated_at, ...rest } = card;

    return {
      ...rest,
      lane: card.lane.title,
      user: {
        id: card.user.id,
        email: card.user.email,
        username: card.user.username,
      },
    };
  }

  async findOwnOne(cardId: string, userId: string) {
    const card = await this.findOne(cardId);
    if (card.user.id !== userId) this.unauhtorized();
    return { card, userId };
  }

  unauhtorized() {
    throw new UnauthorizedException(
      'No tiene permiso para actualizar este card',
    );
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
