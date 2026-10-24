import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { CreateExpenseActions, DeleteExpenseActions, LoadExpensesActions, UpdateExpenseActions } from "./expenses.actions";
import { Expense, ExpenseCategory } from "../expenses.models";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../../shared/store/operation-state";

export interface ExpensesState extends EntityState<Expense> {
    tripId: number | null;
    category: ExpenseCategory | null;
    nextCursor: number | null;
    hasNextPage: boolean;

    list: OperationState; 
    more: OperationState;
    create: OperationState;
    update: OperationState;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const initialState: ExpensesState = {
    ids: [],
    entities: {},
    tripId: null,
    category: null,

    nextCursor: null,
    hasNextPage: false,

    list: initialOperation,
    more: initialOperation,
    create: initialOperation,
    update: initialOperation,

    deletingIds: [],
    deleteErrors: [],
};

export const adapter: EntityAdapter<Expense> = createEntityAdapter<Expense>({
    sortComparer: (a, b) => b.id - a.id,
});


function matchesSlice(state: ExpensesState, tripId: number, category: ExpenseCategory | null): boolean {
    return state.tripId === tripId && state.category === category;
}

export const expensesReducer = createReducer(
    initialState,
    on(LoadExpensesActions.loadExpenses, (state, { tripId, category }) => {
        const changed = !matchesSlice(state, tripId, category);
        const next: ExpensesState = {
            ...state,
            tripId,
            category,
            list: loadingOp(),
            more: initialOperation,
        };
        return changed
            ? adapter.removeAll({
                ...next,
                nextCursor: null,
                hasNextPage: false,
                create: initialOperation,
                update: initialOperation,
                deletingIds: [],
                deleteErrors: [],
            })
            : next;
    }),
    on(LoadExpensesActions.loadExpensesSuccess, (state, { response, tripId, category }) =>
        !matchesSlice(state, tripId, category)
            ? state
            : adapter.setAll(response.data, {
                ...state,
                nextCursor: response.nextCursor,
                hasNextPage: response.hasNextPage,
                list: successOp(),
    })),
    on(LoadExpensesActions.loadExpensesFailure, (state, { error }) => ({
        ...state,
        list: failedOp(error),
    })),
    on(LoadExpensesActions.loadMoreExpenses, (state) => ({
        ...state,
        more: loadingOp(),
    })),
    on(LoadExpensesActions.loadMoreExpensesSuccess, (state, { response, tripId, category }) =>
        !matchesSlice(state, tripId, category)
            ? state
            : adapter.upsertMany(response.data, {
                ...state,
                nextCursor: response.nextCursor,
                hasNextPage: response.hasNextPage,
                more: successOp(),
            })
    ),
    on(LoadExpensesActions.loadMoreExpensesFailure, (state, { error }) => ({
        ...state,
        more: failedOp(error),
    })),
    on(CreateExpenseActions.createExpense, (state) => ({
        ...state,
        create: loadingOp(),
    })),
    on(CreateExpenseActions.createExpenseSuccess, (state, { expense, tripId }) => {
        const next: ExpensesState = { ...state, create: successOp() };
        if (state.tripId !== tripId) return next;
        if (state.category && expense.category !== state.category) return next;
        return adapter.addOne(expense, next);
    }),
    on(CreateExpenseActions.createExpenseFailure, (state, { error }) => ({
        ...state,
        create: failedOp(error),
    })),
    on(CreateExpenseActions.clearCreateError, (state) => ({
        ...state,
        create: state.create.status === 'error' ? initialOperation : state.create,
    })),
    on(UpdateExpenseActions.updateExpense, (state) => ({
        ...state,
        update: loadingOp(),
    })),
    on(UpdateExpenseActions.updateExpenseSuccess, (state, { expense, tripId }) => {
        const next: ExpensesState = { ...state, update: successOp() };
        if (state.tripId !== tripId) return next;
        return state.category && expense.category !== state.category
            ? adapter.removeOne(expense.id, next)
            : adapter.updateOne({ id: expense.id, changes: expense }, next);
    }),
    on(UpdateExpenseActions.updateExpenseFailure, (state, { error }) => ({
        ...state,
        update: failedOp(error),
    })),
    on(UpdateExpenseActions.clearUpdateError, (state) => ({
        ...state,
        update: state.update.status === 'error' ? initialOperation : state.update,
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