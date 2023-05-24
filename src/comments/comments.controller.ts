import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('comments')
@Auth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.deleteComment(id);
  }
}
