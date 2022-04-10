import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsArray,
  ValidateNested,
  IsDate,
  IsDateString,
} from 'class-validator';
import { Schedule } from '../entities/schedule.entity';

export class CreateScheduleInput {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

export class CreateScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleInput)
  schedules: CreateScheduleInput[];
}
