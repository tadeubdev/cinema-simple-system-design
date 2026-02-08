import { Movie } from 'src/movies/movie.entity';
import { Room } from 'src/rooms/room.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { SessionSeat } from './session-seat.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  movie: Movie;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  room: Room;

  @Column()
  startsAt: Date;

  @OneToMany(() => SessionSeat, (ss) => ss.session, { cascade: true })
  seats: SessionSeat[];
}
