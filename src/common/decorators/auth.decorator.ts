import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { UserCookieGuard } from 'src/auth/guards/user-cookie.guard';

export function Auth(...args: any) {
  return applyDecorators(UseGuards(AuthGuard()));
}

// Esta es una forma de usar el applyDecorators
// applyDecorators(
//     RoleProtected(...roles), //setea en la metadata los roles del usuario
//     UseGuards(AuthGuard(), UserRoleGuard), //verifica jwtstrategy y luego verifica los roles del user sacados del metadata con reflector
//   );
