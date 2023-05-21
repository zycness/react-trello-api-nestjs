import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Repository } from 'typeorm';
// import { Lane } from 'src/lanes/entities/lane.entity';
import { LanesService } from 'src/lanes/lanes.service';

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

  async create(createCardDto: CreateCardDto) {
    try {
      const lane = await this.laneServices.findOne(createCardDto.lane);
      const card = this.cardRepository.create({ ...createCardDto, lane });
      this.cardRepository.save(card);
      return { ...createCardDto, lane: lane.id };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const cards = await this.cardRepository.find({});

    return cards.map((card) => {
      let plainCard = { ...card, lane: card.lane.id };

      return plainCard;
    });
  }

  async findOne(id: string) {
    try {
      return await this.cardRepository.findOneBy({ id });
      // return { ...card, lane: card.lane.id };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const { lane, ...toUpdate } = updateCardDto;

    const card = await this.cardRepository.preload({
      id,
      ...toUpdate,
    });

    if (!card) throw new NotFoundException(`Card with id ${id} not found`);

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

  async remove(id: string) {
    try {
      let card = await this.cardRepository.findOneBy({ id });
      if (!card) throw new NotFoundException(`Card with id: ${id}`);

      await this.cardRepository.remove(card);
    } catch (error) {
      this.handleDBExceptions(error);
    }

    return `This action removes a #${id} card`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
