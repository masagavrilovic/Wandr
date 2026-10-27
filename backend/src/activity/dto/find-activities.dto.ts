import { IsDateString, IsOptional, IsString } from 'class-validator';
import { CursorPaginationQueryDto } from '../../common/dto/cursor-pagination.dto';

export class FindActivitiesQueryDto extends CursorPaginationQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}