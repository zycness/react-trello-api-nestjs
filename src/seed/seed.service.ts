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
    await this.laneServices.deleteAllLanes();

    const initialData = ['VENDO', 'COMPRO', 'ALQUILO', 'REGALO'];

    let insertPromises = [];

    initialData.forEach((text) => {
      insertPromises.push(this.laneServices.create({ title: text }));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
