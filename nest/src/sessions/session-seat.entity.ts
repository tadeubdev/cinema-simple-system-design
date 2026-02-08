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

  @Column()
  sessionId: string;

  @Column()
  seatId: string;

  @Column({
    type: 'enum',
    enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
    default: 'AVAILABLE',
  })
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';

  @ManyToOne(() => Session, (session) => session.seats, { onDelete: 'CASCADE' })
  session: Session;

  @ManyToOne(() => Seat, { onDelete: 'CASCADE' })
  seat: Seat;
}
