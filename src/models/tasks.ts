import { TaskType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateOrPutTaskDTO {
  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @IsUUID()
  @IsNotEmpty()
  scheduleId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsEnum(TaskType)
  @IsNotEmpty()
  type: TaskType;
}
