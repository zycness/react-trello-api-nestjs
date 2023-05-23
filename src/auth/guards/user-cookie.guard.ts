import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UserCookieGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token; // Obtener el token de la cookie

    try {
      const decoded = this.jwtService.verify(token); // Verificar el token utilizando el servicio JwtService de NestJS
      request.user = decoded; // Adjuntar los datos decodificados al objeto request para su uso posterior
      return true;
    } catch (error) {
      console.log('Cookie no válido');
      return false;
    }
  }
}
