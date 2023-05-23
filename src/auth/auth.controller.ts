import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserCookieGuard } from './guards/user-cookie.guard';
import { Request, Response } from 'express';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto, @Res() response: Response) {
    return this.authService.login(loginDto, response);
  }

  @Post('logout')
  logout(@Body() logOut: LoginDto, @Res() response: Response) {
    return this.authService.logout(logOut, response);
  }

  @Get('check-status')
  @Auth()
  checkStatus(@Req() request: Request) {
    return request.cookies;
  }
}
