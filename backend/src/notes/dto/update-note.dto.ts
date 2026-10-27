import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content: string;
}
