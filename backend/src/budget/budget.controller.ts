import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/payments/create-payment.dto';
import { UpdatePaymentDto } from './dto/payments/update-payment.dto';
import { CreateExpenseDto } from './dto/expenses/create-expense.dto';
import { UpdateExpenseDto } from './dto/expenses/update-expense.dto';

@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get(':tripId/settlements')
  getSettlements(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any) {
    return this.budgetService.getSettlements(tripId, req.user.id);
  }

  @Get(':tripId/payments')
  findPayments(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any) {
    return this.budgetService.findPayments(tripId, req.user.id);
  }

  @Post(':tripId/payments')
  createPayment(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Body() createPaymentDto: CreatePaymentDto) {
    return this.budgetService.createPayment(tripId, req.user.id, createPaymentDto);
  }

  @Patch(':tripId/payments/:id')
  updatePayment(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.budgetService.updatePayment(tripId, req.user.id, id, updatePaymentDto);
  }

  @Delete(':tripId/payments/:id')
  removePayment(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.budgetService.removePayment(tripId, req.user.id, id);
  }

  @Post(':tripId')
  create(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Body() createExpenseDto: CreateExpenseDto) {
    return this.budgetService.create(tripId, req.user.id, createExpenseDto);
  }

  @Get(':tripId')
  findAll(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any) {
    return this.budgetService.findAll(tripId, req.user.id);
  }

  @Get(':tripId/:id')
  findOne(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.budgetService.findOne(tripId, req.user.id, id);
  }

  @Patch(':tripId/:id')
  update(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.budgetService.update(tripId, req.user.id, id, updateExpenseDto);
  }

  @Delete(':tripId/:id')
  remove(@Param('tripId', ParseIntPipe) tripId: number, @Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.budgetService.remove(tripId, req.user.id, id);
  }
}
