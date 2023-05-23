import { IsNotEmpty, IsString, IsEmail, Length, IsNumber, Min, Max, MinLength } from 'class-validator';
import { IsAdvitersEmail } from '../decorators/IsAdvitersEmail.decorator';

export class RequestCodeDto {

  @IsNotEmpty()
  @IsEmail({}, { message: 'Proporcione un email válido' })
  @IsAdvitersEmail()
  readonly email: string;

}
