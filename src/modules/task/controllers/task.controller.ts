import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/modules/common/authentication';
import { NormalResponse } from 'src/modules/share';
import { TaskService } from '../services';
import { AuthUser } from 'src/modules/share/auth/auth-user.decorator';
import { UserPayload } from 'src/modules/share/auth/auth.interface';
import { TaskDto, TaskUpdateDto } from '../dtos/task.dto';

@Controller('task')
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
    constructor(
        private taskService: TaskService,
    ) {}

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    public async getTasks(@AuthUser() user: UserPayload) {
        return this.taskService.getTasks(user);
    }

    @Get('/:id')
    @UseGuards(JwtAuthenticationGuard)
    public async getTask(@AuthUser() user: UserPayload, @Param('id') id: number) {
        return this.taskService.getTask(user, id);
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    public async createTask(@AuthUser() user: UserPayload, @Body() task: TaskDto): Promise<NormalResponse> {
        return this.taskService.createTask(user, task);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthenticationGuard)
    public async deleteTask(@AuthUser() user: UserPayload, @Param('id') id: number): Promise<NormalResponse> {
        return this.taskService.deleteTask(user, id);
    }

    @Put('/:id')
    @UseGuards(JwtAuthenticationGuard)
    public async updateTask(@AuthUser() user: UserPayload, @Param('id') id: number, @Body() task: TaskUpdateDto): Promise<NormalResponse> {
        return this.taskService.updateTask(user, id, task);
    }
}
