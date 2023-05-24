import {
  IsIn,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MinLength(1)
  label: string;

  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  @MinLength(1)
  @IsIn(['VENDO', 'COMPRO', 'ALQUILO', 'REGALO', '1', '2', '3', '4'])
  lane: string;
}
