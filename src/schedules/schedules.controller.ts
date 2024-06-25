import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateOrPutScheduledDTO, IdParam, PatchScheduledDTO } from '../models';

@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  async get() {
    // Would add some query param filters for pagination & filtering
    return await this.schedulesService.getSchedules();
  }

  @Post()
  async post(@Body() body: CreateOrPutScheduledDTO) {
    return await this.schedulesService.createSchedule(body);
  }

  @Get(':id')
  async getById(@Param() params: IdParam) {
    return await this.schedulesService.getSchedule(params.id);
  }

  @Delete(':id')
  async delete(@Param() params: IdParam) {
    return await this.schedulesService.deleteSchedule(params.id);
  }

  @Patch(':id')
  async patch(@Param() params: IdParam, @Body() body: PatchScheduledDTO) {
    return await this.schedulesService.updateSchedule(params.id, body);
  }

  @Put(':id')
  async put(@Param() params: IdParam, @Body() body: CreateOrPutScheduledDTO) {
    return await this.schedulesService.createOrReplaceSchedule(params.id, body);
  }
}
