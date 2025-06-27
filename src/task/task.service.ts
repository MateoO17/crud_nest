import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entitys/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';
import { User } from 'src/user/entities/user.entity';
import { TaskStatus } from './status/status-task';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new HttpException(
        'Task with id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return task;
  }

  async createTask(task: CreateTaskDto) {
    const user = await this.userRepository.findOneBy({ id: task.user });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newTask = this.taskRepository.create({
      title: task.title,
      description: task.description,
      user: user,
      status: TaskStatus.PENDING, // Default status
    });
    return this.taskRepository.save(newTask);
  }

  async update(id: number, task: CreateTaskDto): Promise<Task> {
    const existingTask = await this.taskRepository.findOneBy({ id });
    if (!existingTask) {
      throw new HttpException(
        'Task with id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const UpdatedTask = Object.assign(existingTask, task);
    return this.taskRepository.save(UpdatedTask);
  }

  async updateStatus(id: number, status: UpdateStatusTaskDto): Promise<Task> {
    const existingTask = await this.taskRepository.findOneBy({ id });
    if (!existingTask) {
      throw new HttpException(
        'Task with id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
    existingTask.status = status.status;
    return this.taskRepository.save(existingTask);
  }

  async delete(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected) {
      throw new HttpException(
        'Task with id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
