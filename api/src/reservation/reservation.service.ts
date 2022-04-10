import { Between, Repository } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ScheduleService } from 'src/schedule/schedule.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

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
      status: 'new',
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
      console.log('ERROR: ', error);
    }
  }

  async findAll() {
    const res = await this.reservationRepository.find();
    console.log('find all', res);
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
