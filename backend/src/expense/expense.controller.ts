import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post(':tripId')
  create(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(tripId, req.user.id, createExpenseDto);
  }

  @Get(':tripId')
  findAll(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any) {
    return this.expenseService.findAll(tripId, req.user.id);
  }

  @Get(':tripId/:id')
  findOne(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.expenseService.findOne(tripId, req.user.id, id);
  }

  @Patch(':tripId/:id')
  update(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(tripId, req.user.id, id, updateExpenseDto);
  }

  @Delete(':tripId/:id')
  remove(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.expenseService.remove(tripId, req.user.id, id);
  }
}
