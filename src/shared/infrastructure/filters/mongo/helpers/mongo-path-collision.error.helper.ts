import { Request } from 'express';
import { MongoError } from 'mongodb';
export function pathCollisionErrorHelper(_: MongoError, request: Request): string {
  const rawQueryString = request.url.split('?')[1];
  return `Path collision. Query string: '${decodeURIComponent(
    rawQueryString,
  )}'. Read README.md file and send the right odata parameters for $select, $selectPopulate and $populate`;
}
