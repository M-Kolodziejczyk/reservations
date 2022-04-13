import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { JwtGuard } from 'src/users/guard/jwt.guard';
import { ReservationService } from './reservation.service';
import { GetUser } from '../users/decorator/get-user.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';

@UseGuards(JwtGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser() user: User,
  ) {
    return this.reservationService.create(user, createReservationDto);
  }

  @Get()
  async findAll(@GetUser('id') id: string) {
    const statistics = await this.reservationService.getUserStatistics(+id);
    const reservations = await this.reservationService.findUserReservations(
      +id,
    );

    return {
      statistics,
      reservations,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
