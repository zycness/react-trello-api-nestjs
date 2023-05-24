import { IsNotEmpty, IsEmail, IsNumber, Min, Max } from 'class-validator';
import { IsAdvitersEmail } from '../decorators/IsAdvitersEmail.decorator';

export class ActivateDto {

    @IsNotEmpty()
    @IsEmail({}, { message: 'Proporcione un email válido' })
    @IsAdvitersEmail()
    readonly email: string;

    @IsNumber()
    @Min(100000)
    @Max(999999)
    readonly code: number;
}