import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @Column()
  customerEmail: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';

  @CreateDateColumn()
  createdAt: Date;
}
