import { Card } from 'src/cards/entities/card.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Lane {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { unique: true })
  title: string;

  @OneToMany(() => Card, (card) => card.lane)
  cards: Card[];
}
