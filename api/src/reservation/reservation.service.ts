import { differenceInHours } from 'date-fns';
import { DateUtils } from 'typeorm/util/DateUtils';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ScheduleService } from 'src/schedule/schedule.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    private scheduleService: ScheduleService,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async create(user: User, createReservationDto: CreateReservationDto) {
    const { date, title } = createReservationDto;
    const res = await this.scheduleService.checkAvailability(user.id, date);

    if (res.length === 0) {
      throw new BadRequestException('Nie można zarezerwować w tych godzinnach');
    }

    const res2 = await this.checkAvailability(user.id, date);
    if (res2.length > 0) {
      throw new BadRequestException('Godzina jest już zarezerwowana');
    }

    const newDate = new Date(date);
    const datePlusHour = new Date(newDate.setHours(newDate.getHours() + 1));

    const reservation = this.reservationRepository.create({
      title,
      from: date,
      to: datePlusHour.toISOString(),
    });

    reservation.user = user;

    const createdReservation = await this.reservationRepository.save(
      reservation,
    );
    return createdReservation;
  }

  async checkAvailability(userId: number, date: string) {
    const dateFormat = DateUtils.mixedDateToUtcDatetimeString(date);

    const datePlusHour = new Date(
      new Date(date).setMinutes(new Date(date).getMinutes() + 59),
    ).toISOString();

    const datePlusMinute = new Date(
      new Date(date).setMinutes(new Date(date).getMinutes() + 1),
    ).toISOString();

    const datePlusHourFormat =
      DateUtils.mixedDateToUtcDatetimeString(datePlusHour);

    try {
      const result = await this.reservationRepository.find({
        where: [
          {
            user: {
              id: userId,
            },
            from: Between(dateFormat, datePlusHourFormat),
          },
          {
            user: {
              id: userId,
            },
            to: Between(datePlusMinute, datePlusHourFormat),
          },
        ],
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserStatistics(userId: number) {
    const schedules = await this.scheduleService.findUserSchedule(userId);
    const statistics = [];

    for (const schedule of schedules) {
      const reservations = await this.userReservationsBetweenHours(
        userId,
        schedule.from,
        schedule.to,
      );
      const scheduleHours = differenceInHours(
        new Date(schedule.to),
        new Date(schedule.from),
      );

      const stat = {
        date: schedule.from,
        reservations: reservations.length,
        available: scheduleHours - reservations.length,
        blocked: reservations.length,
      };

      statistics.push(stat);
    }

    return statistics;
  }

  async userReservationsBetweenHours(userId: number, form: Date, to: Date) {
    const fromDateFormated = DateUtils.mixedDateToUtcDatetimeString(form);
    const toDateFormated = DateUtils.mixedDateToUtcDatetimeString(to);

    return this.reservationRepository.find({
      where: {
        user: {
          id: userId,
        },
        from: MoreThanOrEqual(fromDateFormated),
        to: LessThanOrEqual(toDateFormated),
      },
    });
  }

  findUserReservations(id: number) {
    return this.reservationRepository.find({
      where: {
        user: {
          id: id,
        },
      },
    });
  }

  findOne(id: number) {
    return this.reservationRepository.findOne(id);
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('Brak rezerwacji');
    }

    return this.reservationRepository.remove(reservation);
  }
}
