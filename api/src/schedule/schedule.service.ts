import {
  Between,
  Equal,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';

import { Schedule } from './entities/schedule.entity';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { User } from '../users/entities/user.entity';
import { CreateScheduleInput } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(user: User, schedules: CreateScheduleInput[]) {
    for (const scheduleItem of schedules) {
      const schedule = this.scheduleRepository.create(scheduleItem);
      schedule.user = user;

      const res = await this.scheduleRepository.save(schedule);
      console.log(res);
    }
    return 'This action adds a new schedule';
  }

  async checkAvailability(userId: number, date: string) {
    const dateFormat = DateUtils.mixedDateToUtcDatetimeString(date);
    const newDate = new Date(date);
    const datePlusHour = new Date(newDate.setHours(newDate.getHours() + 1));

    const datePlusHourFormat =
      DateUtils.mixedDateToUtcDatetimeString(datePlusHour);

    try {
      const result = await this.scheduleRepository.find({
        where: {
          user: {
            id: userId,
          },
          from: LessThanOrEqual(dateFormat),
          to: MoreThanOrEqual(datePlusHourFormat),
        },
      });
      return result;
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  findAll() {
    const schedules = this.scheduleRepository.find();
    console.log('Schedules', schedules);
    return schedules;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
