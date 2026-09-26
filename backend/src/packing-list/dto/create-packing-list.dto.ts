import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PackingList } from "../entities/packing-list.entity";

export class CreatePackingListItemDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsEnum(PackingList)
    listType: PackingList;
}
