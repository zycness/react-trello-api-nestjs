import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebsocketsService } from './websockets.service';
import { Socket, Server } from 'socket.io';
import {OnEvent} from '@nestjs/event-emitter'
import { Card } from 'src/cards/entities/card.entity';

@WebSocketGateway({cors: true, namespace: '/'})
export class WebsocketsGateway {
  constructor(private readonly websocketsService: WebsocketsService) {}

  @WebSocketServer() wss: Server

  @OnEvent('new-card')
  newCard(card: Card){
      this.wss.emit('new-card', card.getPlain())
  }
}
