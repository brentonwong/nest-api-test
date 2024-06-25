import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { SchedulesController } from './schedules/schedules.controller';
import { SchedulesService } from './schedules/schedules.service';
import { PrismaService } from './prisma.service';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [],
  controllers: [TasksController, SchedulesController],
  providers: [SchedulesService, PrismaService, TasksService],
})
export class AppModule {}
