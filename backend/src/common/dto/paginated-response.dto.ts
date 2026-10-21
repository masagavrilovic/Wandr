export class PaginatedResponseDto<T> {
  data: T[];
  nextCursor: number | null;
  hasNextPage: boolean;

  constructor(data: T[], nextCursor: number | null, hasNextPage: boolean) {
    this.data = data;
    this.nextCursor = nextCursor;
    this.hasNextPage = hasNextPage;
  }
}

