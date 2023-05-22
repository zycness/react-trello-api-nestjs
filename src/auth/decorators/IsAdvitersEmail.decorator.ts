
import {createParamDecorator, ExecutionContext, Injectable} from '@nestjs/common'
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsAdvitersEmail' })
@Injectable()
export class IsAdvitersEmailValidation implements ValidatorConstraintInterface {
  constructor() {}

   validate(email: string): boolean {
   return email.endsWith('@adviters.com')
  }
  defaultMessage(args: ValidationArguments) {
    return `El email debe pertenecer a Adviters`;
  }
}

export function IsAdvitersEmail(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsAdvitersEmailValidation,
      });
    };
  }