import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePackingListItemDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    text?: string;

    @IsOptional()
    @IsInt()
    assignedToId?: number | null;
}
