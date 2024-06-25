import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { IsAfter } from '../core/validation';

export class CreateOrPutScheduledDTO {
  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @IsNumber()
  @IsNotEmpty()
  agentId: number;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsAfter('startTime')
  @IsNotEmpty()
  endTime: string;
}

export class PatchScheduledDTO {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  accountId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  agentId?: number;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsAfter('startTime')
  @IsNotEmpty()
  @IsOptional()
  endTime?: string;

  @IsOptional()
  @IsDateString()
  deletedAt?: string | null;
}
