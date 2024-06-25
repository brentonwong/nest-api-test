import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { CreateOrPutTaskDTO, IdParam } from '../models';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async get() {
    return await this.tasksService.getTasks();
  }

  @Post()
  async post(@Body() body: CreateOrPutTaskDTO) {
    return await this.tasksService.create(body);
  }

  @Get(':id')
  async getById(@Param() params: IdParam) {
    return await this.tasksService.getTask(params.id);
  }

  @Delete(':id')
  async delete(@Param() params: IdParam) {
    return await this.tasksService.deleteTask(params.id);
  }

  @Put(':id')
  async put(@Param() params: IdParam, @Body() body: CreateOrPutTaskDTO) {
    return await this.tasksService.putTask(params.id, body);
  }
}
