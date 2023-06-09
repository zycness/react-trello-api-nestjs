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
import { DataSource, Equal, ILike, QueryResult, Repository } from 'typeorm';
import { LanesService } from 'src/lanes/lanes.service';
import { User } from 'src/auth/entities/user.entity';
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
      let plainCardObj = await card.getPlain();
      arr.push(plainCardObj);
    });

    console.log('2');
    return arr;
  }

  async findOnePlain(id: string, queryCard: string) {
    if (queryCard && queryCard?.length > 0) {
      let res = await this.cardRepository.find({
        where: {
          title: ILike(`%${queryCard}%`),
        },
      });

      if (res && res?.length > 0) {
        let arr = [];

        res.forEach(async (card) => {
          console.log(card);
          let plainCardObj = card.getPlain();
          arr.push(plainCardObj);
        });
        return arr;
      }
      return res;
    }

    const card =  await this.findOne(id);
    return card.getPlain()
  }

  async getCardComments(id: string) {
    return [];
  }

  async findOne(id: string) {
    const card = await this.cardRepository.findOneBy({ id });
    console.log('card', card);
    if (!card) throw new NotFoundException(`Card with id ${id} not found`);
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userId: string) {
    let { lane, ...toUpdate } = updateCardDto;

    const { card } = await this.findOwnOne(id, userId);

    let moved;

    const preload = await this.cardRepository.preload({
      ...card,
      ...toUpdate,
    });

    try {
      if (lane) {
        preload.lane = await this.laneServices.findOne(lane);
      }
      await this.cardRepository.save(preload);

      if (card.lane.id !== preload.lane.id) {
        moved = {
          fromId: card.lane.id,
          from: card.lane.title,
          toId: preload.lane.id,
          to: preload.lane.title,
          userId: card.user.id,
          username: card.user.username,
          cardId: card.id,
        };

        this.eventEmitter.emit('move-card', moved);
      } else this.eventEmitter.emit('update-card', preload);

      return preload.getPlain();
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

      await queryRunner.manager.delete(Card, { id: card.id });
      await queryRunner.manager.delete(Comment, { cardId: card.id });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      this.eventEmitter.emit('delete-card', card);

      return {
        message: 'Cards and comments deleted successfuly',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return this.handleDBExceptions(error);
    }
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
