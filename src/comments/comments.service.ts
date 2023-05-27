import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ){}
  async createComment(cardId: string, createCommentDto: CreateCommentDto) {
    return this.commentsRepository.save({
      cardId,
      ...createCommentDto,
      created_by: createCommentDto.username
    });
  }

  async getCardComments(cardId: string) {
    const comment = await this.commentsRepository.findBy({cardId})
    return comment.map(comment => ({...comment, dateString: comment.getDateMessage()}));
  }

  async deleteComment(id: string) {
    const {affected} = await this.commentsRepository.delete({id});
    
    if (affected === 0) throw new InternalServerErrorException('No se pudo eliminar el comentario')
    
    return {
      message: 'El comentario fue eliminado'
    }
  }
}
