import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tickets')
@Unique(['sessionSeatId'])
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  sessionSeatId: string;

  @CreateDateColumn()
  issuedAt: Date;
}
