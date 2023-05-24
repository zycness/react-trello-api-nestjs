import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength, NotContains } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(15)
    @NotContains(' ')
    username: string

}
