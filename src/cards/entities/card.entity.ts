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
      dateString: this.getDateMessage(),
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

  getDateMessage(){
    const ahora = new Date();
    const diferencia = ahora.getTime() - this.created_at.getTime();
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias * 30);
  
    if (meses > 1) return `Hace ${meses} meses`
    else if (meses === 1) return 'Hace un mes'
    if (dias > 1) return `Hace ${dias} días`;
    else if (dias === 1) return 'Ayer';
    else if (horas > 1) return `Hace ${horas} horas`;
    else if (horas === 1) return 'Hace una hora';
    else if (minutos > 1) return `Hace ${minutos} minutos`;
    else if (minutos === 1) return 'Hace un minuto';
    else return 'Hace unos segundos';
  }
  
}
