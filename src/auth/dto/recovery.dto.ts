import { IsNotEmpty, IsString, IsEmail, Length, IsNumber, Min, Max, MinLength } from 'class-validator';
import { IsAdvitersEmail } from '../decorators/IsAdvitersEmail.decorator';

export class RecoveryDto {

  @IsNotEmpty()
  @IsEmail({}, { message: 'Proporcione un email válido' })
  @IsAdvitersEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly password: string;

  @IsNumber()
  @Min(100000)
  @Max(999999)
  readonly code: number;
}
