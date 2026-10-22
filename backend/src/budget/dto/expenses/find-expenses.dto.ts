import { IsEnum, IsOptional } from 'class-validator';
import { CursorPaginationQueryDto } from '../../../common/dto/cursor-pagination.dto';
import { ExpenseCategory } from '../../entities/expense.entity';

export class FindExpensesQueryDto extends CursorPaginationQueryDto {
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;
}