export interface PaginatedResult<T> {
  docs:        T[];
  totalDocs:   number;
  totalPages:  number;
  page:        number;
  limit:       number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage:    number | null;
  prevPage:    number | null;
}

export function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const totalDocs   = items.length;
  const totalPages  = Math.ceil(totalDocs / limit);
  const safePage    = Math.min(Math.max(1, page), totalPages || 1);
  const start       = (safePage - 1) * limit;
  const docs        = items.slice(start, start + limit);

  return {
    docs,
    totalDocs,
    totalPages,
    page:        safePage,
    limit,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
    nextPage:    safePage < totalPages ? safePage + 1 : null,
    prevPage:    safePage > 1 ? safePage - 1 : null,
  };
}
