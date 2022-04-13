import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { JwtGuard } from 'src/users/guard/jwt.guard';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetUser } from '../users/decorator/get-user.decorator';

@UseGuards(JwtGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto, @GetUser() user: User) {
    return this.scheduleService.create(user, createScheduleDto.schedules);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.scheduleService.findUserSchedule(userId);
  }
}
