import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTodosV1Usecase } from '../get-all-todos.v1.usecase';
import { getModelToken } from '@nestjs/mongoose';
import { TODOS_REPOSITORY_TOKEN } from '@todos/infrastructure/module/ioc-tokens/repositories/todos-repositories.ioc.tokens';
import { UNIT_OF_WORK_TOKEN } from '@shared/infrastructure/modules/unit-of-work/ioc-tokens/unit-of-work.ioc.tokens';
import { ModuleRef } from '@nestjs/core';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import { TODOS_MONGODB_COLLECTION_NAME } from '@todos/infrastructure/constants/todos-mongodb.constants';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
import { ObjectId } from 'bson';
import { IGetAllUsecaseParams } from '@shared/application/types/usecases.types';
import { LoggerService } from '@shared/services/logger.service';
import { map, omit } from 'lodash';

describe('FEATURE: List all TODOs', () => {
  let usecase: GetAllTodosV1Usecase;
  let mockModel: any;
  let mockRepository: any;
  let mockUnitOfWork: any;
  let mockModuleRef: any;

  const mockTodos = [
    {
      _id: new ObjectId(),
      title: 'Test Todo 1',
      description: 'Test Description 1',
      completed: false,
      due_date: new Date(),
      priority: 'medium' as const,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      toJSON: jest.fn().mockReturnValue({
        _id: new ObjectId(),
        title: 'Test Todo 1',
        description: 'Test Description 1',
        completed: false,
        due_date: new Date(),
        priority: 'medium' as const,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    },
    {
      _id: new ObjectId(),
      title: 'Test Todo 2',
      description: 'Test Description 2',
      completed: true,
      due_date: new Date(),
      priority: 'high' as const,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      toJSON: jest.fn().mockReturnValue({
        _id: new ObjectId(),
        title: 'Test Todo 2',
        description: 'Test Description 2',
        completed: true,
        due_date: new Date(),
        priority: 'high' as const,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    },
  ];

  const mockPaginatedResult: any = {
    items: mockTodos,
    totalItems: 2,
    currentPage: 1,
    totalPageItems: 2,
    totalPages: 1,
    top: 100,
    skip: 0,
  };

  beforeEach(async () => {
    mockModel = {
      find: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockRepository = {
      setModel: jest.fn(),
      getAll: jest.fn().mockResolvedValue(mockTodos),
      getTotalItems: jest.fn().mockResolvedValue(2),
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
        LoggerService,
        GetAllTodosV1Usecase,
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

    usecase = module.get<GetAllTodosV1Usecase>(GetAllTodosV1Usecase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SCENARIO: Initialize GetAllTodosV1Usecase', () => {
    describe('GIVEN: All dependencies are properly injected', () => {
      it('THEN: should be defined', () => {
        expect(usecase).toBeDefined();
      });

      it('THEN: should set model on repository', () => {
        expect(mockRepository.setModel).toHaveBeenCalledWith(mockModel);
      });
    });
  });

  describe('SCENARIO: List TODOs successfully', () => {
    const mockParams: IGetAllUsecaseParams<TodoEntity> = {
      rawQueryString: '',
      query: {},
      request: {} as any,
      dbSession: undefined,
    };

    describe('GIVEN: Repository returns paginated todos', () => {
      it('THEN: should return paginated todos successfully', async () => {
        const result = await usecase.execute(mockParams);

        const expectedResult = {
          ...mockPaginatedResult,
          items: map(mockPaginatedResult.items, (item) => item.toJSON()),
        };
        expect(result).toEqual(expectedResult);
        expect(mockRepository.getAll).toHaveBeenCalled();
      });
    });


  });

  describe('SCENARIO: Repository errors occur', () => {
    const mockParams: IGetAllUsecaseParams<TodoEntity> = {
      rawQueryString: '',
      query: {},
      request: {} as any,
      dbSession: undefined,
    };

    describe('GIVEN: Repository throws database error', () => {
      beforeEach(() => {
        const error = new Error('Database error');
        mockRepository.getAll = jest.fn().mockRejectedValue(error);
      });

      it('THEN: should handle repository errors', async () => {
        await expect(usecase.execute(mockParams)).rejects.toThrow('Database error');
      });
    });
  });

  describe('SCENARIO: OData query parameters are provided', () => {
    describe('GIVEN: Filter parameter is provided', () => {
      const paramsWithOData: IGetAllUsecaseParams<TodoEntity> = {
        rawQueryString: "$filter=priority eq 'high'&$top=5&$skip=0",
        query: {
          $filter: "priority eq 'high'",
          $top: '5',
          $skip: '0',
        },
        request: {} as any,
        dbSession: undefined,
      };


    });

    describe('GIVEN: Pagination parameters are provided', () => {
      const paramsWithPagination: IGetAllUsecaseParams<TodoEntity> = {
        rawQueryString: '',
        query: {
          $top: '1',
          $skip: '0',
        },
        request: {} as any,
        dbSession: undefined,
      };

      const paginatedResult: any = {
        items: mockTodos.slice(0, 1),
        totalPages: 2,
        currentPage: 1,
        skip: 0,
        top: 1,
        totalItems: 2,
        totalPageItems: 2,
      };

      it('THEN: should handle pagination parameters', async () => {
        const result: any = await usecase.execute(paramsWithPagination);

        expect(omit(result, 'items')).toEqual(omit(paginatedResult, 'items'));
        expect(result.items).toHaveLength(2);
        expect(result.totalPages).toBe(2);
      });
    });

    describe('GIVEN: Sorting parameter is provided', () => {
      const paramsWithSorting: IGetAllUsecaseParams<TodoEntity> = {
        rawQueryString: '',
        query: {
          $orderby: 'created_at desc',
        },
        request: {} as any,
        dbSession: undefined,
      };

      it('THEN: should handle sorting parameters', async () => {
        const result = await usecase.execute(paramsWithSorting);

        const expectedResult = {
          ...mockPaginatedResult,
          items: map(mockPaginatedResult.items, (item) => item.toJSON()),
        };
        expect(result).toEqual(expectedResult);
        expect(mockRepository.getAll).toHaveBeenCalled();
      });
    });

    describe('GIVEN: Field selection parameter is provided', () => {
      const paramsWithSelection: IGetAllUsecaseParams<TodoEntity> = {
        rawQueryString: '',
        query: {
          $select: 'title,completed',
        },
        request: {} as any,
        dbSession: undefined,
      };

      it('THEN: should handle field selection parameters', async () => {
        const result = await usecase.execute(paramsWithSelection);

        const expectedResult = {
          ...mockPaginatedResult,
          items: map(mockPaginatedResult.items, (item) => item.toJSON()),
        };
        expect(result).toEqual(expectedResult);
        expect(mockRepository.getAll).toHaveBeenCalled();
      });
    });
  });

  describe('SCENARIO: Null or undefined parameters are provided', () => {
    describe('GIVEN: All parameters are null', () => {
      const nullParams: IGetAllUsecaseParams<TodoEntity> = {
        rawQueryString: null as any,
        query: null as any,
        request: null as any,
        dbSession: null as any,
      };

      it('THEN: should handle null parameters gracefully', async () => {
        const result = await usecase.execute(nullParams);
        const expectedResult = {
          ...mockPaginatedResult,
          items: map(mockPaginatedResult.items, (item) => item.toJSON()),
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('GIVEN: All parameters are undefined', () => {
      const undefinedParams: IGetAllUsecaseParams<TodoEntity> = {
        rawQueryString: undefined as any,
        query: undefined as any,
        request: undefined as any,
        dbSession: undefined,
      };

      it('THEN: should handle undefined parameters gracefully', async () => {
        const result = await usecase.execute(undefinedParams);
        const expectedResult = {
          ...mockPaginatedResult,
          items: map(mockPaginatedResult.items, (item) => item.toJSON()),
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
