import { User } from 'src/auth/entities/user.entity';
import { Lane } from 'src/lanes/entities/lane.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Card } from './card.entity';

@Entity()
export class CardComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.comments, {
    cascade: true,
    eager: true,
  })
  user: User;

  @ManyToOne(() => Lane, (lane) => lane.cards, {
    cascade: true,
  })
  card: Card;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column('text', {
    nullable: true,
  })
  created_by: string;

  @Column('text', {
    nullable: true,
  })
  updated_by?: string;

  @BeforeInsert()
  setAuditData() {
    this.created_by = this.user.id;
  }

  @BeforeUpdate()
  setUpdateData() {
    this.updated_by = this.user.id;
  }
}
