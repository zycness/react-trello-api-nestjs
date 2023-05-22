import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Repository } from 'typeorm';
import { LanesService } from 'src/lanes/lanes.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    // @InjectRepository(Lane)
    // private readonly laneRepository: Repository<Lane>,
    private readonly laneServices: LanesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCardDto: CreateCardDto, user: User) {
    try {
      const lane = await this.laneServices.findOne(createCardDto.lane);
      const card = this.cardRepository.create({ ...createCardDto, lane, user });
      this.cardRepository.save(card);
      return { ...createCardDto, lane: lane.id };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const cards = await this.cardRepository.find({});

    return cards.map(card => this.plainCard(card));
  }

  async findOnePlain(id: string){
    return this.plainCard(await this.findOne(id))
  }

  async findOne(id: string) {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) throw new NotFoundException(`Card with id ${id} not found`);
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userId: string) {
    const { lane, ...toUpdate } = updateCardDto;

    await this.findOwnOne(id, userId)

    const card = await this.cardRepository.preload({
      id,
      ...toUpdate,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (lane) {
        card.lane = await this.laneServices.findOne(lane);
      }
      await queryRunner.manager.save(card);
      await queryRunner.commitTransaction();
      queryRunner.release();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, userId: string) {
    let card = await this.findOwnOne(id, userId);
    try {
      await this.cardRepository.remove(card);
    } catch (error) {
      this.handleDBExceptions(error);
    }

    return `Card with id #${id} was removed`;
  }

  plainCard(card: Card){
    const {created_by, created_at, updated_by, updated_at, ...rest} = card
    return {
      ...rest, 
      lane: card.lane.id, 
      user: {
        id: card.user.id,
        email: card.user.email,
        username: card.user.username
      } 
    }
  }

  async findOwnOne(cardId: string, userId: string){
    const card = await this.findOne(cardId);
    if (card.user.id !== userId) this.unauhtorized();
    return card;
  }

  unauhtorized(){
    throw new UnauthorizedException('No tiene permiso para actualizar este card')
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
