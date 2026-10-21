export interface PaginatedResponse<T> {
    data: T[];
    nextCursor: number | null;
    hasNextPage: boolean;
}