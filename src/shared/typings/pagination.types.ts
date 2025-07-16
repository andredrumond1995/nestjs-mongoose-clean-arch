export interface IPaginatedItems<T> extends IPagination {
  items: T;
}

export interface IPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  totalPageItems: number;
  top: number;
  skip: number;
}
