import {
  BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text')
    description: string;
  
    @Column('text')
    username: string;
  
    @Column('text')
    cardId: string
  
    @CreateDateColumn()
    created_at?: Date;
  
    @Column('text')
    created_by: string;
  }
  