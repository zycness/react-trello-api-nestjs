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
import { DataSource, Equal, Repository } from 'typeorm';
import { LanesService } from 'src/lanes/lanes.service';
import { User } from 'src/auth/entities/user.entity';
import { CardComment } from './entities/card-comment.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(CardComment)
    private readonly commentRepository: Repository<CardComment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // @InjectRepository(Lane)
    // private readonly laneRepository: Repository<Lane>,
    private readonly laneServices: LanesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCardDto: CreateCardDto, user: User) {
    try {
      const lane = await this.laneServices.findOne(createCardDto.lane);
      const card = this.cardRepository.create({ ...createCardDto, lane, user });
      await this.cardRepository.save(card);
      return { ...createCardDto, lane: lane.title };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const cards = await this.cardRepository.find({
      relations: {
        user: true,
        comments: true,
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

  async findOne(id: string) {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) throw new NotFoundException(`Card with id ${id} not found`);
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userId: string) {
    let { lane, ...toUpdate } = updateCardDto;

    await this.findOwnOne(id, userId);

    if (updateCardDto.comment.description) {
      await this.createComment(
        await this.cardRepository.findOneBy({ id }),
        await this.userRepository.findOneBy({ id: userId }),
        updateCardDto.comment.description,
      );
    }

    const card = await this.cardRepository.preload({
      id,
      ...toUpdate,
    });
    try {
      if (lane) {
        card.lane = await this.laneServices.findOne(lane);
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, userId: string) {
    let { card } = await this.findOwnOne(id, userId);
    try {
      await this.cardRepository.remove(card);
    } catch (error) {
      this.handleDBExceptions(error);
    }

    return `Card with id #${id} was removed`;
  }

  async createComment(card: Card, user: User, description: string) {
    const comment = {
      card,
      user,
      description,
    };

    let commentCreated = this.commentRepository.create(comment);

    return this.commentRepository.save(commentCreated);
  }

  async plainCard(card: Card) {
    const {
      created_by,
      created_at,
      updated_by,
      updated_at,
      comments,
      ...rest
    } = card;

    let plainComments = [];

    if (comments !== null) {
      plainComments = await this.getPlainComments(comments);
    }

    let obj = {
      ...rest,
      lane: card.lane.title,
      user: {
        id: card.user.id,
        email: card.user.email,
        username: card.user.username,
      },
      comments: [...plainComments],
    };

    // return obj;

    return obj;
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

  async getPlainComments(comments: CardComment[]) {
    let commentsArr = [];

    comments?.forEach((comment: CardComment) => {
      let { description, id, user } = comment;

      commentsArr.push({
        description,
        id,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    });

    return commentsArr;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
