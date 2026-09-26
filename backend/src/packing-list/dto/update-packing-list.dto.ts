import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PackingCategory } from '../entities/packing-list.entity';

export class UpdatePackingListItemDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    text?: string;

    @IsOptional()
    @IsInt()
    assignedToId?: number | null;

    @IsOptional()
    @IsEnum(PackingCategory)
    category?: PackingCategory;
}
