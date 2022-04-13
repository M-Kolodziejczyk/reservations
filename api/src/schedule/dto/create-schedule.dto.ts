import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsDateString } from 'class-validator';

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
