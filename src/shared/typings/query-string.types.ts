import QueryString from 'qs';

export interface IQuery extends QueryString.ParsedQs {
  $filter?: string;
  $top?: string;
  $skip?: string;
  $orderby?: string;
  $select?: string;
  $expand?: string;
  $populate?: string;
  $nestedFilter?: string;
  $selectPopulate?: string;
  $aggregate?: string;
  $include_deleted?: string;
}
