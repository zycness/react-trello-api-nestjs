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
  