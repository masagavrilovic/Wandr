import { UserSummaryDto } from "../../user/dto/user-response.dto";
import { PackingList, PackingListItem } from "../entities/packing-list.entity";

export class PackingListItemResponseDto {
    id: number;
    listType: PackingList;
    text: string;
    assignedTo: UserSummaryDto | null;

    constructor(packingListItem: PackingListItem) {
        this.id = packingListItem.id;
        this.listType = packingListItem.listType;
        this.text = packingListItem.text;
        this.assignedTo = packingListItem.assignedTo
            ? new UserSummaryDto(packingListItem.assignedTo)
            : null;
    }

}