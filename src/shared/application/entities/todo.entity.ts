import { FullPartial } from '@shared/typings/partial.types';
import { todosCreateZodSchema, todosUpdateZodSchema } from '@todos/domain/validators/todos.zod';
import { ObjectId } from 'bson';
import { assign } from 'lodash';

export class TodoEntity {
  public _id?: ObjectId;
  public is_deleted?: boolean;
  public created_at?: string;
  public updated_at?: string;
  public constructor(partial: FullPartial<TodoEntity>) {
    assign(this, partial);
  }

  public static validateCreate(input: unknown): FullPartial<TodoEntity> {
    return todosCreateZodSchema.parse(input) as FullPartial<TodoEntity>;
  }

  public static validateUpdate(input: unknown): FullPartial<TodoEntity> {
    return todosUpdateZodSchema.parse(input) as FullPartial<TodoEntity>;
  }
}
