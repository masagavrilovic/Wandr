import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreateExpensePayload, Expense, ExpenseCategory, UpdateExpensePayload } from "../expenses.models";
import { PaginatedResponse } from "../../../shared/pagination.models";

export const BudgetTabActions = createActionGroup({
  source: 'Budget Tab',
  events: {
    'Opened': emptyProps(),
  },
});

export const ExpenseFilterActions = createActionGroup({
    source: 'Expense Filter',
    events: {
        'Set Category': props<{ category: ExpenseCategory | null }>(),
    }
});

export const LoadExpensesActions = createActionGroup({
    source: 'Expenses',
     events: {
        'Load Expenses': props<{ tripId: number, category: ExpenseCategory | null }>(),
        'Load Expenses Success': props<{ response: PaginatedResponse<Expense>, tripId: number, category: ExpenseCategory | null }>(),
        'Load Expenses Failure': props<{ error: string }>(),

        'Load More Expenses': emptyProps(),
        'Load More Expenses Success': props<{ response: PaginatedResponse<Expense>, tripId: number, category: ExpenseCategory | null }>(),
        'Load More Expenses Failure': props<{ error: string }>(),
    }
});

export const CreateExpenseActions = createActionGroup({
    source: 'Expenses',
    events: {
        'Create Expense': props<{ payload: CreateExpensePayload }>(),
        'Create Expense Success': props<{ expense: Expense, tripId: number }>(),
        'Create Expense Failure': props<{ error: string }>(),
        'Clear Create Error': emptyProps(),
    }
});

export const UpdateExpenseActions = createActionGroup({
  source: 'Expenses',
  events: {
        'Update Expense': props<{ id: number, payload: UpdateExpensePayload }>(),
        'Update Expense Success': props<{ expense: Expense, tripId: number }>(),
        'Update Expense Failure': props<{ error: string }>(),
        'Clear Update Error': emptyProps(),
  }
});

export const DeleteExpenseActions = createActionGroup({
    source: 'Expenses',
    events: {
        'Delete Expense': props<{ id: number }>(),
        'Delete Expense Success': props<{ id: number, tripId: number }>(),
        'Delete Expense Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
});