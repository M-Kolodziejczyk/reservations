import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  date: Date;

  @Column()
  status: 'NEW' | 'BLOCKED';

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;
}
