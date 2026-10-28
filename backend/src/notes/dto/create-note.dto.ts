import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    content?: string;
}
