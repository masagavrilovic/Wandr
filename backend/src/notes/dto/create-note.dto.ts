import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { NoteColor } from "../entities/note.entity";

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsEnum(NoteColor)
    color?: NoteColor;
}
