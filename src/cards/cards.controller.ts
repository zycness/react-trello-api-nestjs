import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import {AuthGuard} from '@nestjs/passport'

@Controller('cards')
@UseGuards(AuthGuard())
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(
    @Body() createCardDto: CreateCardDto,
    @Req() req) {
    return this.cardsService.create(createCardDto, req.user);
  }

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cardsService.findOnePlain(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Req() req
  ) {
    return this.cardsService.update(id, updateCardDto, req?.user?.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.cardsService.remove(id, req?.user?.id);
  }
}
