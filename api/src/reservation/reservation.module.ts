import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), ScheduleModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
