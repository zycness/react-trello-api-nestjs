
import { Card } from 'src/cards/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column('int', {
    default: Math.floor(Math.random() * 899999 + 100000),
  })
  securityCode: number;

  @Column('boolean', {
    default: false
  })
  activated: boolean

  @OneToMany(() => Card, (card) => card.user)
  cards?: Card[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  updateSecurityCode() {
    this.securityCode = Math.floor(Math.random() * 899999 + 100000);
  }
}
