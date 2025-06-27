import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../status/status-task';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ default: 'pending', type: 'enum', enum: TaskStatus })
  status: TaskStatus;
  @ManyToOne(() => User, (user) => user.task, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;
}
