import { Injectable } from '@nestjs/common';
import { DateUtils } from 'typeorm/util/DateUtils';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(user: User, schedules: CreateScheduleInput[]) {
    const savedSchedules = [];

    for (const scheduleItem of schedules) {
      const schedule = this.scheduleRepository.create(scheduleItem);
      schedule.user = user;

      const savedSchedule = await this.scheduleRepository.save(schedule);

      savedSchedules.push(savedSchedule);
    }

    return savedSchedules;
  }

  checkAvailability(userId: number, date: string) {
    const dateFormat = DateUtils.mixedDateToUtcDatetimeString(date);
    const newDate = new Date(date);
    const datePlusHour = new Date(newDate.setHours(newDate.getHours() + 1));

    const datePlusHourFormat =
      DateUtils.mixedDateToUtcDatetimeString(datePlusHour);

    return this.scheduleRepository.find({
      where: {
        user: {
          id: userId,
        },
        from: LessThanOrEqual(dateFormat),
        to: MoreThanOrEqual(datePlusHourFormat),
      },
    });
  }

  findUserSchedule(userId: number) {
    return this.scheduleRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        from: 'ASC',
      },
    });
  }
}
