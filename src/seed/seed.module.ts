import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { LanesModule } from 'src/lanes/lanes.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [LanesModule],
})
export class SeedModule {}
