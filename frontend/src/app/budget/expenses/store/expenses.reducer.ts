import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { CreateExpenseActions, DeleteExpenseActions, LoadExpensesActions, UpdateExpenseActions } from "./expenses.actions";
import { Expense, ExpenseCategory } from "../expenses.models";

export interface ExpensesState extends EntityState<Expense> {
    isLoading: boolean;
    loadingError: string | null;
    tripId: number | null;
    nextCursor: number | null;
    hasNextPage: boolean;

    isCreating: boolean;
    createError: string | null;

    isUpdating: boolean;
    updateError: string | null;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];

    category: ExpenseCategory | null;
}

export const initialState: ExpensesState = {
    ids: [],
    entities: {},
    isLoading: false,
    loadingError: null,
    tripId: null,
    nextCursor: null,
    hasNextPage: false,

    isCreating: false,
    createError: null,

    isUpdating: false,
    updateError: null,

    deletingIds: [],
    deleteErrors: [],

    category: null,
};

export const adapter: EntityAdapter<Expense> = createEntityAdapter<Expense>({
    sortComparer: (a, b) => b.id - a.id,
});

export const expensesReducer = createReducer(
    initialState,
    on(LoadExpensesActions.loadExpenses, (state, { tripId, cursor, category }) => {
        const next = {
            ...state,
            isLoading: true,
            loadingError: null,
            tripId,
            category: category ?? null,
        };
        return cursor === null
            ? adapter.removeAll({ ...next, nextCursor: null, hasNextPage: false })
            : next;
    }),
    on(LoadExpensesActions.loadExpensesSuccess, (state, { response }) =>
        adapter.addMany(response.data, {
            ...state,
            isLoading: false,
            nextCursor: response.nextCursor,
            hasNextPage: response.hasNextPage,
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
        state.category && expense.category !== state.category
        ? { ...state, isCreating: false }
        : adapter.addOne(expense, { ...state, isCreating: false })
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
         state.category && expense.category !== state.category
        ? adapter.removeOne(expense.id, { ...state, isUpdating: false })
        : adapter.updateOne({ id: expense.id, changes: expense }, { ...state, isUpdating: false })
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