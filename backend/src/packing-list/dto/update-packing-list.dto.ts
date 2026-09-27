import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PackingCategory, PackingList } from '../entities/packing-list.entity';

export class UpdatePackingListItemDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    text?: string;

    @IsOptional()
    @IsEnum(PackingList)
    listType?: PackingList;

    @IsOptional()
    @IsBoolean()
    assigned?: boolean;

    @IsOptional()
    @IsEnum(PackingCategory)
    category?: PackingCategory;
}
