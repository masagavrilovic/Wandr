import { IsDateString, IsOptional } from 'class-validator';
import { CursorPaginationQueryDto } from '../../common/dto/cursor-pagination.dto';

export class FindNotesQueryDto extends CursorPaginationQueryDto {
    @IsOptional()
    @IsDateString()
    updatedAt?: string;
}