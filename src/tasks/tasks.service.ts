import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrPutTaskDTO, PatchScheduledDTO } from '../models';
import { Interval, isWithinInterval, parseISO } from 'date-fns';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  getTasks = async () => {
    // similar to scheudles, would add filtering, pagination
    return await this.prisma.task.findMany();
  };

  getTask = async (id: string) => {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  };

  deleteTask = async (id: string) => {
    const task = await this.getTask(id);
    if (task.deletedAt) {
      throw new BadRequestException('The task has already been deleted');
    }
    return await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  };

  create = async (data: CreateOrPutTaskDTO) => {
    await this.validateCreateOrPutPayload(data);
    const result = await this.prisma.task.create({
      data,
    });
    return result;
  };

  patch = async (id: string, data: PatchScheduledDTO) => {
    const task = await this.getTask(id);
    if (!task) throw new NotFoundException('Task not found');
    return await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  };

  putTask = async (id: string, data: CreateOrPutTaskDTO) => {
    await this.validateCreateOrPutPayload(data);
    return await this.prisma.task.upsert({
      where: {
        id,
      },
      create: data,
      update: {
        ...data,
        updatedAt: new Date(),
      },
    });
  };

  private validateCreateOrPutPayload = async (data: CreateOrPutTaskDTO) => {
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        id: data.scheduleId,
        accountId: data.accountId,
      },
    });

    if (!schedule) {
      throw new BadRequestException('Schedule does not exist for account');
    }

    if (
      !isWithinScheduleInternal(data.startTime, {
        start: schedule.startTime,
        end: schedule.endTime,
      })
    ) {
      throw new BadRequestException(
        'Task does not start or finish within the schedule period',
      );
    }

    // I'm not sure of what time period the duration relates to eg.g days, hours, I would also validate this
  };
}

const isWithinScheduleInternal = (
  taskStartTime: string,
  scheduleInterval: Interval,
) => {
  return isWithinInterval(taskStartTime, scheduleInterval);
};
