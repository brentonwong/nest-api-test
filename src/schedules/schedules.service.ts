import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrPutScheduledDTO, PatchScheduledDTO } from '../models';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  getSchedules = async () => {
    const results = await this.prisma.schedule.findMany();
    // usually here I would map the data to a new type with only the necessary fields required to be returned via the api
    return results;
  };

  getSchedule = async (id: string) => {
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });

    if (!schedule) throw new NotFoundException('Schedule not found');

    return schedule;
  };

  deleteSchedule = async (id: string) => {
    const schedule = await this.getSchedule(id);
    if (schedule.deletedAt) {
      throw new BadRequestException('The schedule has already been deleted');
    }
    return await this.prisma.schedule.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  };

  createSchedule = async (data: CreateOrPutScheduledDTO) => {
    const result = await this.prisma.schedule.create({
      data,
    });
    return result;
  };

  updateSchedule = async (id: string, data: PatchScheduledDTO) => {
    const schedule = await this.getSchedule(id);
    if (!schedule) throw new NotFoundException('Schedule not found');
    return await this.prisma.schedule.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  };

  createOrReplaceSchedule = async (
    id: string,
    data: CreateOrPutScheduledDTO,
  ) => {
    return await this.prisma.schedule.upsert({
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
}
