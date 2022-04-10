import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Reservation } from './reservation/entities/reservation.entity';
import { Schedule } from './schedule/entities/schedule.entity';
import { ReservationModule } from './reservation/reservation.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Reservation, Schedule],
      synchronize: true,
    }),
    UsersModule,
    ReservationModule,
    ScheduleModule,
  ],
})
export class AppModule {}
