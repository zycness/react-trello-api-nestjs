import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";
import { IsAdvitersEmail } from "../decorators/IsAdvitersEmail.decorator";


export class LoginDto {

    @IsNotEmpty()
    @IsEmail({}, {message: 'Ingresa un email válido'})
    @IsAdvitersEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    readonly password: string
    
}