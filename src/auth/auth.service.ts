import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response, response } from 'express';
import { RequestCodeDto } from './dto/requestCode.dto';
import { RecoveryDto } from './dto/recovery.dto';
import { serialize } from 'cookie';
import { ActivateDto } from './dto/activate.dto';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto, res: Response) {
    const { username, email, password } = signUpDto;

    try {

      const hashedPassword = await bcrypt.hash(password, +process.env.HASH_SALTS);

      const user = await this.userRepository.save({
        username,
        email,
        password: hashedPassword,
      });
  
      await this.sendVerifyEmail(user);

      return { 
        message: 'Verifique su email'
      };

    } catch (e) {


      if (e.code === '23505') {

        if (e.detail.includes('username')) throw new BadRequestException('El usuario ya existe')

        throw new BadRequestException('El email ya está en uso')

      }
      console.log(e);

      throw new InternalServerErrorException('Ocurrió un error en el servidor')
      
    }
    
  }

  async activateAccount(activateDto: ActivateDto, res: Response){

    const {email, code} = activateDto;

    const user = await this.getUser(email);

    if (code !== user.securityCode) return res.status(401).json({
      message: 'Ocurrió un error de validación'
    })

    user.activated = true;
    user.updateSecurityCode();
    await this.userRepository.save(user);

    return res.status(200).redirect('/login')
  }

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;

    const user = await this.getUser(email);

    await this.isValidPassword(password, user.password);

    if (!user.activated) throw new BadRequestException('Verifique su dirección de correo electrónico')

    const token = this.getAccessToken(user.id);

    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        path: '/',
      }),
    );
    return { token };
  }

  async requestSecurityCode(requestCodeDto: RequestCodeDto){

    const {email} = requestCodeDto;

    const user = await this.getUser(email);

    try {

      await this.sendRecoveryEmail(user);

      return {
        message: 'Código enviado'
      }

    } catch (error) {

      console.log(error);

      return new InternalServerErrorException('Ocurrió un error, intente nuevamente');

    }

  }

  async changePassword(recoveryDto: RecoveryDto){

    const {email, code, password} = recoveryDto;

    const user = await this.getUser(email);

    if (code !== user.securityCode) throw new BadRequestException('El código es incorrecto')
    
    const newPassword = await bcrypt.hash(password, +process.env.HASH_SALTS);
    user.updateSecurityCode();

    await this.userRepository.save({
      ...user,
      password: newPassword
    })

    return {
      message: 'Contraseña cambiada con éxito'
    }

  }

  async logout(logOutUser: LoginDto, response: Response) {
    const { email, password } = logOutUser;

    const user = await this.getUser(email);

    await this.isValidPassword(password, user.password);

    response.clearCookie('token');

    return 'Logout successful';
  }

  invalidCredentials() {
    throw new UnauthorizedException('Email o contraseña incorrectos.');
  }

  async getUser(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException('El usuario no existe.');
    return user;
  }

  async isValidPassword(tryPass: string, savedPass: string) {
    const isPasswordValid = await bcrypt.compare(tryPass, savedPass);
    if (!isPasswordValid) this.invalidCredentials();
    return true;
  }

  getAccessToken(id: any): string {
    return this.jwtService.sign({ id });
  }

  async sendVerifyEmail(user: User) {

    const subject = 'Verificar email';

    const link = `${process.env.SERVER_ADRESS}/api/auth/activate?email=${user.email}&code=${user.securityCode}`

    const html = `¡Hola, ${user.username}!
             Bienvenido. <br/>
             Utilice el siguiente enlace para verificar su email.
             <a href="${link}">${link}</a>`;

    return this.sendEmail(user.email, subject, html);

  }

  async sendRecoveryEmail(user: User) {

    const subject = 'Recuperar contraseña';

    const html = `¡Hola, ${user.username}!
             Ha solicitado un código de recuperación de contraseña. <br/>
             Ingrese el siguiente código en la ventana de recuperación.
             Código: <b>${user.securityCode}</b>`;

    return this.sendEmail(user.email, subject, html);

  }

  private async sendEmail(to: string, subject: string, html: string){
    const config = {
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    };

    const email = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html
    };

    const transport = nodeMailer.createTransport(config);

    return await transport.sendMail(email);
  }
}
