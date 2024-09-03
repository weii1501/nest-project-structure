import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Roles } from './role.entity';
import { Task } from '../task/task.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 255,
    name: 'name',
  })
  name!: string;

  @Exclude()
  @Column('varchar', {
    nullable: false,
    length: 255,
    name: 'password',
  })
  password!: string;

  @Column('varchar', {
    nullable: true,
    length: 255,
    name: 'email',
  })
  email!: string;
  @ManyToMany(() => Roles, (roles) => roles.id)
  roles!: Roles[];

  @OneToMany(() => Task, (task) => task.createdBy)
  createTasks: Task[];

  @ManyToMany(() => Task, (task) => task.assignedUsers)
  assignedTasks: Task[];

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
