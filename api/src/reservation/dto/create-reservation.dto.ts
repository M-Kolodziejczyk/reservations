import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsDateString()
  date: string;
}
