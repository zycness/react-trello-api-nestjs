import { IsString, MinLength } from 'class-validator';

export class CreateLaneDto {
  @IsString()
  @MinLength(1)
  title: string;
}
