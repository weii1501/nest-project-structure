import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user';
import { Exclude } from 'class-transformer';

enum TaskStatus {
  NOT_STARTED = 'not started',
  PREPARING = 'preparing',
  IN_PROGRESS = 'in progress',
  IN_REVIEW = 'in review',
  COMPLETED = 'completed',
}

@Entity('task')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 255,
    name: 'title',
  })
  title: string;

  @Column('varchar', {
    nullable: false,
    length: 255,
    name: 'description',
  })
  description: string;

  @Column({
    nullable: false,
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
    type: 'enum',
  })
  status: TaskStatus;

  @Column('date', {
    nullable: true,
    name: 'startDate',
  })
  startDate: Date;

  @Column('date', {
    nullable: true,
    name: 'endDate',
  })
  endDate: Date;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user: User;

  constructor(partial: Partial<Task>) {
    super();
    Object.assign(this, partial);
  }
}
