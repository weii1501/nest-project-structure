import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, User } from 'src/entity';
import { UtilService } from 'src/modules/common';
import { NormalResponse } from 'src/modules/share';
import { UserPayload } from 'src/modules/share/auth/auth.interface';
import { Repository } from 'typeorm';
import { TaskDto, TaskUpdateDto } from '../dtos/task.dto';

@Injectable()
export class TaskService {
  constructor(
    private utils: UtilService,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async createTask(user: UserPayload, task: TaskDto): Promise<NormalResponse> {
    const newUser = await this.userRepository.findOne({ where: { id: user.id } });

    if (!newUser) {
      throw new Error('User not found');
    }

    const newTask = new Task({
      title: task.title,
      description: task.description,
      user: newUser,
    });

    await this.taskRepository.save(newTask);
    return this.utils.buildSuccessResponse(newTask);
  }

  public async getTasks(user: UserPayload): Promise<NormalResponse> {
    const tasks = await this.taskRepository.find({ where: { user: { id: user.id } } });
    return this.utils.buildSuccessResponse(tasks);
  }

  public async getTask(user: UserPayload, id: number): Promise<NormalResponse> {
    const task = await this.taskRepository.findOne({ where: { user: { id: user.id }, id: id } });

    if (!!!task) {
        throw new HttpException('Task not found', 404);
    }

    return this.utils.buildSuccessResponse(task);
  }

  public async deleteTask(user: UserPayload, id: number): Promise<NormalResponse> {
    const task = await this.taskRepository.findOne({ where: { user: { id: user.id }, id: id } });

    if (!task) {
      throw new Error('Task not found');
    }

    await this.taskRepository.remove(task);
    return this.utils.buildSuccessResponse('Task deleted successfully');
  }

  public async updateTask(user: UserPayload, id: number, task: TaskUpdateDto): Promise<NormalResponse> {
    const taskToUpdate = await this.taskRepository.findOne({ where: { user: { id: user.id }, id: id } });

    if (!taskToUpdate) {
      throw new Error('Task not found');
    }

    taskToUpdate.title = task.title;
    taskToUpdate.description = task.description;
    taskToUpdate.status = task.status;
    
    if (!!task.startDate) {
      taskToUpdate.startDate = new Date(task.startDate);
    }
    if (!!task.endDate) {
      taskToUpdate.endDate = new Date(task.endDate);
    }

    await this.taskRepository.save(taskToUpdate);
    return this.utils.buildSuccessResponse(taskToUpdate);
  }
}
