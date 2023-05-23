import { Controller, Body, Post, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signUp(signUpDto, response);
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, response);
  }

  @Post('logout')
  @Auth()
  logout(
    @Body() logOut: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(logOut, response);
  }

  @Get('check-status')
  @Auth()
  checkStatus() {
    return {
      ok: true,
    };
  }
}
