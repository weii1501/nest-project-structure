/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
// import { Server } from 'typeorm';
import { Server } from 'socket.io';
import { Message } from 'src/entity/message';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  @WebSocketServer() server!: Server;
  constructor(@InjectRepository(Message) private messageRepository: Repository<Message>) {}

  @SubscribeMessage('message')
  async sendChat(@MessageBody() content: any): Promise<void> {
    console.log(content);
    this.messageRepository.save(content);
    this.server.emit('message', content);
  }
}
