import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, ExpensesState } from "./expenses.reducer";


export const expensesFeature = createFeatureSelector<ExpensesState>('expenses');
const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors(expensesFeature);
export const selectAllExpenses = selectAll;
export const selectExpenseEntities = selectEntities;
export const selectExpenseIds = selectIds;
export const selectExpensesTotal = selectTotal;

export const selectExpensesLoading = createSelector(expensesFeature, (state) => state.isLoading);
export const selectExpensesLoadingError = createSelector(expensesFeature, (state) => state.loadingError);

export const selectExpenseCreating = createSelector(expensesFeature, (state) => state.isCreating);
export const selectExpenseCreatingError = createSelector(expensesFeature, (state) => state.createError);