export interface IODataQueryParams {
  $filter: string;
  $select: string;
  $skip: string;
  $top: string;
}

export type INPUT_TYPES = 'audio' | 'screenshot' | 'text';
