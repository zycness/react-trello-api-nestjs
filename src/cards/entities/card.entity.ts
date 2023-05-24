import { User } from 'src/auth/entities/user.entity';
import { Lane } from 'src/lanes/entities/lane.entity';
import {
  BeforeInsert,
  ManyToOne,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.cards, { cascade: true, eager: true })
  user: User;

  @ManyToOne(() => Lane, (lane) => lane.cards, { cascade: true, eager: true })
  lane: Lane;

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
    this.updated_by = this.user.id;
  }

  getPlain(){
    return {
      id: this.id,
      updated_at: this.updated_at,
      created_at: this.created_at,
      label: this.label,
      title: this.title,
      description: this.description,
      lane: {
        id: this.lane.id,
        title: this.lane.title
      },
      user: {
        id: this.user.id,
        username: this.user.username,
        email: this.user.email
      }
    }
  }
}
