import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum TaskStatus {
  NOT_STARTED = 'not started',
  PREPARING = 'preparing',
  IN_PROGRESS = 'in progress',
  IN_REVIEW = 'in review',
  COMPLETED = 'completed',
}

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  assignedUsers: string;
}

export class TaskUpdateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus, {
    message: 'Status must be one of the following: not started, preparing, in progress, in review, completed',
  })
  @IsNotEmpty()
  status: TaskStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  assignedUsers?: string;
}
