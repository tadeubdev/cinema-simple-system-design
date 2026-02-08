import { Seat } from 'src/rooms/seat.entity';
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Session } from './session.entity';

@Entity('session_seats')
@Unique(['session', 'seat'])
export class SessionSeat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, (session) => session.seats, { onDelete: 'CASCADE' })
  session: Session;

  @ManyToOne(() => Seat, { onDelete: 'CASCADE' })
  seat: Seat;

  @Column({
    type: 'enum',
    enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
    default: 'AVAILABLE',
  })
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
}
