import { Column, 
  CreateDateColumn, 
  Entity, ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true
  })
  username: string;

  @Column('text', {
    unique: true
  })
  email: string;

  @Column('text')
  password: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}










