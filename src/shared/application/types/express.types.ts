import { Request } from 'express';
import { ClientSession } from 'mongoose';
import { IFiles } from './http-request.types';

export interface IExpressRequest extends Request {
  db?: {
    session?: ClientSession;
  };
  files?: IFiles;
  ignoreLanguageCodeHeader?: boolean;
}
