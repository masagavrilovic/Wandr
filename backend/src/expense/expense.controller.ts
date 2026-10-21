import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get(':tripId/settlements')
  getSettlements(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any) {
    return this.expenseService.getSettlements(tripId, req.user.id);
  }

  @Get(':tripId/payments')
  findPayments(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any) {
    return this.expenseService.findPayments(tripId, req.user.id);
  }

  @Post(':tripId/payments')
  createPayment(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Body() createPaymentDto: CreatePaymentDto) {
    return this.expenseService.createPayment(tripId, req.user.id, createPaymentDto);
  }

  @Patch(':tripId/payments/:id')
  updatePayment(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.expenseService.updatePayment(tripId, req.user.id, id, updatePaymentDto);
  }

  @Delete(':tripId/payments/:id')
  removePayment(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.expenseService.removePayment(tripId, req.user.id, id);
  }

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
