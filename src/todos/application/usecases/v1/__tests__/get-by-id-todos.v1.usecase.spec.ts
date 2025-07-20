import { Test, TestingModule } from '@nestjs/testing';
import { GetByIdTodosV1Usecase } from '../get-by-id-todos.v1.usecase';
import { getModelToken } from '@nestjs/mongoose';
import { TODOS_REPOSITORY_TOKEN } from '@todos/infrastructure/module/ioc-tokens/repositories/todos-repositories.ioc.tokens';
import { UNIT_OF_WORK_TOKEN } from '@shared/infrastructure/modules/unit-of-work/ioc-tokens/unit-of-work.ioc.tokens';
import { ModuleRef } from '@nestjs/core';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import { TODOS_MONGODB_COLLECTION_NAME } from '@todos/infrastructure/constants/todos-mongodb.constants';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
import { ObjectId } from 'bson';
import { IGetByIdUsecaseParams } from '@shared/application/types/usecases.types';

describe('FEATURE: Get TODO by ID', () => {
  let usecase: GetByIdTodosV1Usecase;
  let mockModel: any;
  let mockRepository: any;
  let mockUnitOfWork: any;
  let mockModuleRef: any;

  const mockTodo = {
    _id: new ObjectId(),
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    due_date: new Date(),
    priority: 'medium' as const,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockModel = {
      findById: jest.fn(),
    };

    mockRepository = {
      setModel: jest.fn(),
      getById: jest.fn(),
      getTotalItems: jest.fn().mockResolvedValue(1),
    };

    mockUnitOfWork = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      withTransaction: jest.fn().mockImplementation(async (session, callback) => {
        return callback();
      }),
    };

    mockModuleRef = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetByIdTodosV1Usecase,
        {
          provide: getModelToken(TODOS_MONGODB_COLLECTION_NAME, MONGODB_DATABASE_NAME),
          useValue: mockModel,
        },
        {
          provide: TODOS_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: UNIT_OF_WORK_TOKEN,
          useValue: mockUnitOfWork,
        },
        {
          provide: ModuleRef,
          useValue: mockModuleRef,
        },
      ],
    }).compile();

    usecase = module.get<GetByIdTodosV1Usecase>(GetByIdTodosV1Usecase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SCENARIO: Initialize GetByIdTodosV1Usecase', () => {
    describe('GIVEN: All dependencies are properly injected', () => {
      it('THEN: should be defined', () => {
        expect(usecase).toBeDefined();
      });

      it('THEN: should set model on repository', () => {
        expect(mockRepository.setModel).toHaveBeenCalledWith(mockModel);
      });
    });
  });

  describe('SCENARIO: Repository errors occur', () => {
    const mockId = new ObjectId();
    const mockParams: IGetByIdUsecaseParams<TodoEntity> = {
      id: mockId,
      request: {} as any,
    };

    describe('GIVEN: Repository throws database error', () => {
      beforeEach(() => {
        const error = new Error('Database error');
        mockRepository.getById = jest.fn().mockRejectedValue(error);
      });

      it('THEN: should handle repository errors', async () => {
        await expect(usecase.execute(mockParams)).rejects.toThrow('Database error');
      });
    });
  });

  describe('SCENARIO: OData query parameters are provided', () => {
    const mockId = new ObjectId();
    const mockParams: IGetByIdUsecaseParams<TodoEntity> = {
      id: mockId,
      rawQueryString: '$select=title,completed',
      query: {
        $select: 'title,completed',
      },
      request: {} as any,
    };

    describe('GIVEN: Field selection parameter is provided', () => {
      beforeEach(() => {
        const mockTodoWithToJSON = {
          ...mockTodo,
          toJSON: jest.fn().mockReturnValue(mockTodo),
        };
        mockRepository.getById = jest.fn().mockResolvedValue(mockTodoWithToJSON);
      });

      it('THEN: should handle OData query parameters', async () => {
        const result = await usecase.execute(mockParams);

        expect(result).toEqual(mockTodo);
        expect(mockRepository.getById).toHaveBeenCalled();
      });
    });
  });

  describe('SCENARIO: Null or undefined parameters are provided', () => {
    describe('GIVEN: ID is null', () => {
      const nullParams: IGetByIdUsecaseParams<TodoEntity> = {
        id: null as any,
        request: null as any,
      };

      beforeEach(() => {
        const mockTodoWithToJSON = {
          ...mockTodo,
          toJSON: jest.fn().mockReturnValue(mockTodo),
        };
        mockRepository.getById = jest.fn().mockResolvedValue(mockTodoWithToJSON);
      });

      it('THEN: should handle null ID', async () => {
        const result = await usecase.execute(nullParams);

        expect(result).toEqual(mockTodo);
      });
    });

    describe('GIVEN: ID is undefined', () => {
      const undefinedParams: IGetByIdUsecaseParams<TodoEntity> = {
        id: undefined as any,
        request: undefined as any,
      };

      beforeEach(() => {
        const mockTodoWithToJSON = {
          ...mockTodo,
          toJSON: jest.fn().mockReturnValue(mockTodo),
        };
        mockRepository.getById = jest.fn().mockResolvedValue(mockTodoWithToJSON);
      });

      it('THEN: should handle undefined ID', async () => {
        const result = await usecase.execute(undefinedParams);

        expect(result).toEqual(mockTodo);
      });
    });
  });
});
