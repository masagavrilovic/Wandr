import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PackingCategory, PackingList } from '../entities/packing-list.entity';

export class UpdatePackingListItemDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    text?: string;

    @IsOptional()
    @IsEnum(PackingList)
    listType: PackingList;

    @IsOptional()
    @IsInt()
    assignedToId?: number | null;

    @IsOptional()
    @IsEnum(PackingCategory)
    category?: PackingCategory;
}
