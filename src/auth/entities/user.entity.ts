import { CardComment } from 'src/cards/entities/card-comment.entity';
import { Card } from 'src/cards/entities/card.entity';
import * as nodeMailer from 'nodemailer'
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

  @Column('int', {
    default: Math.floor((Math.random() * 899999) + 100000)
  })
  securityCode: number

  @OneToMany(() => Card, (card) => card.user)
  cards?: Card[];

  @OneToMany(() => CardComment, (cardComment) => cardComment.card)
  comments?: CardComment[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  getRandomCode(){
    return Math.floor((Math.random() * 899999) + 100000);
  }

  async sendRecoveryEmail(){

    const config = {
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    }

    const email = {
      from: process.env.MAIL_USER,
      to: this.email,
      subject: 'Recuperar contraseña',
      html: `¡Hola, ${this.username}!
             Ha solicitado un código de recuperación de contraseña. <br/>
             Ingrese el siguiente código en la ventana de recuperación.
             Código: <b>${this.securityCode}</b>`
    }

    const transport = nodeMailer.createTransport(config);

    return await transport.sendMail(email);

  }
}
