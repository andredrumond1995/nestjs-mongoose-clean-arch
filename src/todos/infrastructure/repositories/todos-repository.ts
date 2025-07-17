import { Injectable } from '@nestjs/common';
import { Repository } from '@shared/infrastructure/repositories/repository';
import { ITodosRepositoryPort } from '@todos/domain/ports/repositories/todos.repository.port';

@Injectable()
export class TodosRepository extends Repository implements ITodosRepositoryPort {}
