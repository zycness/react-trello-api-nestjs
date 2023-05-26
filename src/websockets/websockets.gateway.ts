import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {OnEvent} from '@nestjs/event-emitter'
import { Card } from 'src/cards/entities/card.entity';

@WebSocketGateway({cors: true, namespace: '/'})
export class WebsocketsGateway {

  @WebSocketServer() wss: Server

  @OnEvent('new-card')
  newCard(card: Card){
    this.wss.emit('new-card', card.getPlain())
  }

  @OnEvent('move-card')
  moveCard(moved){
    this.wss.emit('move-card', moved)
  }

  @OnEvent('update-card')
  updateCard(card: Card){
    this.wss.emit('update-card', card.getPlain())
  }

  @OnEvent('delete-card')
  deleteCard(card: Card){
      this.wss.emit('delete-card', {
        laneId: card.lane.id, 
        cardId: card.id,
        username: card.user.username,
        userId: card.user.id
      })
  }
}
