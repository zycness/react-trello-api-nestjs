import { Injectable } from '@nestjs/common';
import { LanesService } from 'src/lanes/lanes.service';

@Injectable()
export class SeedService {
  constructor(private readonly laneServices: LanesService) {}

  async runSeed() {
    await this.insertNewLanes();

    return `SEED EXECUTED`;
  }

  private async insertNewLanes() {
    const lanes = await this.laneServices.findAll();

    console.log(lanes)

    if (lanes.length == 0) {
      const initialData = ['VENDO', 'COMPRO', 'ALQUILO', 'REGALO'];

      console.log('lanes')
      initialData.forEach(async (laneText) => {
        await this.laneServices.create({ title: laneText });
      });
    }

    return true;
  }
}
