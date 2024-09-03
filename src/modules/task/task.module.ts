import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task, User } from 'src/entity';
import { CommonModule } from '../common';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), CommonModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
