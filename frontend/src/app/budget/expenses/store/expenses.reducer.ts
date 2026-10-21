import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { CreateExpenseActions, DeleteExpenseActions, LoadExpensesActions, UpdateExpenseActions } from "./expenses.actions";
import { Expense } from "../expenses.models";

export interface ExpensesState extends EntityState<Expense> {
    isLoading: boolean;
    loadingError: string | null;
    tripId: number | null;

    isCreating: boolean;
    createError: string | null;

    isUpdating: boolean;
    updateError: string | null;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const initialState: ExpensesState = {
    ids: [],
    entities: {},
    isLoading: false,
    loadingError: null,
    tripId: null,

    isCreating: false,
    createError: null,

    isUpdating: false,
    updateError: null,

    deletingIds: [],
    deleteErrors: [],
};

export const adapter: EntityAdapter<Expense> = createEntityAdapter<Expense>({
    sortComparer: (a, b) => b.paidAt.localeCompare(a.paidAt),
});

export const expensesReducer = createReducer(
    initialState,
    on(LoadExpensesActions.loadExpenses, (state, { tripId }) => ({
        ...state,
        isLoading: true,
        loadingError: null,
        tripId,
    })),
    on(LoadExpensesActions.loadExpensesSuccess, (state, { expenses }) =>
        adapter.setAll(expenses, {
            ...state,
            isLoading: false
        })
    ),
    on(LoadExpensesActions.loadExpensesFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        loadingError: error
    })),
    on(CreateExpenseActions.createExpense, (state) => ({
        ...state,
        isCreating: true,
        createError: null
    })),
    on(CreateExpenseActions.createExpenseSuccess, (state, { expense }) =>
        adapter.addOne(expense, {
            ...state,
            isCreating: false
        })
    ),
    on(CreateExpenseActions.createExpenseFailure, (state, { error }) => ({
        ...state,
        isCreating: false,
        createError: error
    })),
    on(CreateExpenseActions.clearCreateError, (state) => ({
        ...state,
        createError: null
    })),
    on(UpdateExpenseActions.updateExpense, (state) => ({
        ...state,
        isUpdating: true,
        updateError: null
    })),
    on(UpdateExpenseActions.updateExpenseSuccess, (state, { expense }) =>
        adapter.updateOne({ id: expense.id, changes: expense }, {
            ...state,
            isUpdating: false
        })
    ),
    on(UpdateExpenseActions.updateExpenseFailure, (state, { error }) => ({
            ...state,
            isUpdating: false,
            updateError: error
    })),
    on(UpdateExpenseActions.clearUpdateError, (state) => ({
        ...state,
        updateError: null
    })),
    on(DeleteExpenseActions.deleteExpense, (state, { id }) => ({
        ...state,
        deletingIds: [...state.deletingIds, id],
        deleteErrors: state.deleteErrors.filter(e => e.id !== id)
    })),
    on(DeleteExpenseActions.deleteExpenseSuccess, (state, { id }) => 
        adapter.removeOne(id, {
            ...state,
            deletingIds: state.deletingIds.filter(x => x !== id)
        })
    ),
    on(DeleteExpenseActions.deleteExpenseFailure, (state, { id, error }) => ({
        ...state,
        deletingIds: state.deletingIds.filter(x => x !== id),
        deleteErrors: [...state.deleteErrors, { id, message: error }]
    })),
    on(DeleteExpenseActions.clearDeleteError, (state, { id }) => ({
        ...state,
        deleteErrors: state.deleteErrors.filter(e => e.id !== id),
    })),
);