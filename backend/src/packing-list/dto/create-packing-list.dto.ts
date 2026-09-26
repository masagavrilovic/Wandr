import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PackingCategory, PackingList } from "../entities/packing-list.entity";

export class CreatePackingListItemDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsEnum(PackingList)
    listType: PackingList;

    @IsEnum(PackingCategory)
    category: PackingCategory;
}
