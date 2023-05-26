import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  Query,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { CommentsService } from 'src/comments/comments.service';

@Controller('cards')
@Auth()
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto, @Req() req) {
    return this.cardsService.create(createCardDto, req.user);
  }

  @Post(':id/comments')
  async createComment(
    @Param('id', ParseUUIDPipe) cardId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(cardId, createCommentDto);
  }

  @Get()
  async findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('q') queryCard: string,
  ) {
    return this.cardsService.findOnePlain(id, queryCard);
  }

  @Get(':id/comments')
  getCardComments(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.getCardComments(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Req() req,
  ) {
    return this.cardsService.update(id, updateCardDto, req?.user?.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.cardsService.remove(id, req?.user?.id);
  }
}
