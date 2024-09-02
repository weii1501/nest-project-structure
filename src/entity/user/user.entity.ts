import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './role.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  get fullName(): string {
    return `fulname is ${this.name}`;
  }
}
