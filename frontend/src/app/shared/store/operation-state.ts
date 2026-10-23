export type OperationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface OperationState {
  status: OperationStatus;
  error: string | null;
}

export const initialOperation: OperationState = { status: 'idle', error: null };

export const loadingOp = (): OperationState => ({ status: 'loading', error: null });
export const successOp = (): OperationState => ({ status: 'success', error: null });
export const failedOp = (error: string): OperationState => ({ status: 'error', error });