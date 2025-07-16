import { FullPartial } from '@shared/typings/partial.types';
import { ObjectId } from 'bson';
import { assign } from 'lodash';
import { todosCreateZodSchema, todosUpdateZodSchema } from '../validators/todos.zod';

export class TodoEntity {
  public _id?: ObjectId;
  public title: string;
  public description?: string;
  public completed: boolean;
  public due_date?: Date;
  public priority?: 'low' | 'medium' | 'high';
  public user_id?: ObjectId;
  public created_at?: Date;
  public updated_at?: Date;
  public is_deleted?: boolean;

  public constructor(partial: FullPartial<TodoEntity>) {
    assign(this, partial);
  }

  public static validateCreate(input: unknown) {
    return todosCreateZodSchema.parse(input);
  }

  public static validateUpdate(input: unknown) {
    return todosUpdateZodSchema.parse(input);
  }
}
