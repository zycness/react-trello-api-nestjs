import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    username: string

}
