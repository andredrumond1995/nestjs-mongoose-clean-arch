import { Injectable } from '@nestjs/common';
import { ITodosRepositoryPort } from '@todos/domain/ports/repositories/todos.repository.port';
import { Repository } from '@shared/infrastructure/repositories';

@Injectable()
export class TodosRepository extends Repository implements ITodosRepositoryPort {}
