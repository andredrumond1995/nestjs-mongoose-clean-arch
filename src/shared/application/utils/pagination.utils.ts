import { size } from 'lodash';
import { IODataParamsDB } from '../types/odata-params.types';
import { IPagination } from '../types/pagination.types';
import { FullPartial } from '@shared/typings/partial.types';

export const generatePagination = <Entity>(
  odataParams: IODataParamsDB,
  items: FullPartial<Entity>[],
  totalItems: number,
): IPagination => {
  const top = odataParams['limit'] ?? 1;
  const skip = odataParams['skip'] ?? 0;
  const currentPage = top > 0 ? Math.floor(skip / top) + 1 : 1;
  const totalPages = top > 0 ? Math.ceil(totalItems / top) : 1;
  const totalPageItems = size(items);

  return { totalItems, currentPage, totalPageItems, totalPages, top, skip };
};
