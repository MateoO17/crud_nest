import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entitys/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';

@Injectable()
export class TaskService {
  @InjectRepository(Task)
  private readonly taskRespository: Repository<Task>;

  async findAll(): Promise<Task[]> {
    return this.taskRespository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRespository.findOneBy({ id });
    if (!task) {
      throw new HttpException(
        'Task with id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return task;
  }

  async create(task: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRespository.create(task);
    return this.taskRespository.save(newTask);
  }

  async update(id: number, task: CreateTaskDto): Promise<Task> {
    const existingTask = await this.taskRespository.findOneBy({ id });
    if (!existingTask) {
      throw new HttpException(
        'Task with id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const UpdatedTask = Object.assign(existingTask, task);
    return this.taskRespository.save(UpdatedTask);
  }

  async updateStatus(id: number, status: UpdateStatusTaskDto): Promise<Task> {
    const existingTask = await this.taskRespository.findOneBy({ id });
    if (!existingTask) {
      throw new HttpException(
        'Task with id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
    existingTask.status = status.status;
    return this.taskRespository.save(existingTask);
  }

  async delete(id: number): Promise<void> {
    const result = await this.taskRespository.delete(id);
    if (result.affected) {
      throw new HttpException(
        'Task with id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
