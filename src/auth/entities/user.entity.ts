import { CardComment } from 'src/cards/entities/card-comment.entity';
import { Card } from 'src/cards/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  username: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @OneToMany(() => Card, (card) => card.user)
  cards?: Card[];

  @OneToMany(() => CardComment, (cardComment) => cardComment.card)
  comments?: CardComment[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
