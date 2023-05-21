import { Lane } from 'src/lanes/entities/lane.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  label: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Lane, (lane) => lane.cards, { cascade: true, eager: true })
  lane: Lane;
}
