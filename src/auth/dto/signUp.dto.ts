import { IsNotEmpty, IsString, IsEmail, MinLength, NotContains, MaxLength } from 'class-validator';
import { IsAdvitersEmail } from '../decorators/IsAdvitersEmail.decorator';
import { Exclude } from 'class-transformer';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  @NotContains(' ')
  readonly username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Ingresa un email válido' })
  @IsAdvitersEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly password: string;
}
