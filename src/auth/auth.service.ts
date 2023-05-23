import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response, response } from 'express';
import { RecoveryDto } from './dto/recovery.dto';
import { RequestCodeDto } from './dto/requestCode.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { username, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, +process.env.HASH_SALTS);

    const user = await this.userRepository.save({
      username,
      email,
      password: hashedPassword,
    });

    const token = this.getAccessToken(user.id);

    return { token };
  }

  async login(loginDto: LoginDto, reponse: Response) {
    const { email, password } = loginDto;

    const user = await this.getUser(email);

    await this.isValidPassword(password, user.password);

    const token = this.getAccessToken(user.id);

    reponse.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });

    return reponse.status(200).json({ token });
  }

  async requestSecurityCode(requestCodeDto: RequestCodeDto){

    const {email} = requestCodeDto;

    const user = await this.userRepository.findOneBy({email})
    if (!user) throw new BadRequestException('El usuario no existe.')

    try {

      await user.sendRecoveryEmail();

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

    const user = await this.userRepository.findOneBy({email});
    if (!user) throw new BadRequestException('El usuario no existe.')

    if (code !== user.securityCode) throw new BadRequestException('El código es incorrecto')
    
    const newPassword = await bcrypt.hash(password, +process.env.HASH_SALTS);
    const newCode = user.getRandomCode();

    await this.userRepository.save({
      ...user,
      password: newPassword,
      securityCode: newCode
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
    if (!user) this.invalidCredentials();
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
}
