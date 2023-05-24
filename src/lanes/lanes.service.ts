import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLaneDto } from './dto/create-lane.dto';
import { UpdateLaneDto } from './dto/update-lane.dto';
import { Equal, Repository } from 'typeorm';
import { Lane } from './entities/lane.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/cards/entities/card.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class LanesService {
  constructor(
    @InjectRepository(Lane)
    private readonly laneRepository: Repository<Lane>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async create(createLaneDto: CreateLaneDto) {
    const lane = this.laneRepository.create(createLaneDto);
    return await this.laneRepository.save(lane);
  }

  findAll() {
    return this.laneRepository.find({});
  }

  async findOne(term: string) {
    let lane: Lane;

    if (isUUID(term)) {
      lane = await this.laneRepository.findOneBy({ id: term });

      if (!lane) throw new NotFoundException(`Lane with id ${term} not found`);
    }

    // title
    if (!lane) {
      lane = await this.laneRepository.findOneBy({ title: term.toUpperCase() });
    }

    if (lane) {
      let cards: Card[] = await this.cardRepository.find({
        where: {
          lane: {
            id: lane.id,
          },
        },
      });

      lane = { ...lane, cards };
    }

    return lane;
  }

  update(id: number, updateLaneDto: UpdateLaneDto) {
    return `This action updates a #${id} lane`;
  }

  remove(id: number) {
    return `This action removes a #${id} lane`;
  }

  async deleteAllLanes() {
    const query = this.laneRepository.createQueryBuilder('lane');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
