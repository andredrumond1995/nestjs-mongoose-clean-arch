export interface IPaginatedItems<ItemsType> extends IPagination {
  items: ItemsType[];
}

export interface IPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  totalPageItems: number;
  top: number;
  skip: number;
}
