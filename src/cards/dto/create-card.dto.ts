import { IsIn, IsString, MinLength } from 'class-validator';

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
  lane: string;
}
