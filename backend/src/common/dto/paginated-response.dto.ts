export class PaginatedResponseDto<T, C = number> {
  data: T[];
  nextCursor: C | null;
  hasNextPage: boolean;

  constructor(data: T[], nextCursor: C | null, hasNextPage: boolean) {
    this.data = data;
    this.nextCursor = nextCursor;
    this.hasNextPage = hasNextPage;
  }
}

