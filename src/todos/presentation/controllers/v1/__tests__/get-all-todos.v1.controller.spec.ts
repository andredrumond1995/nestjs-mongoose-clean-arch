import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTodosV1Controller } from '../get-all-todos.v1.controller';
import { GET_ALL_TODOS_V1_USECASE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/usecases/todos-usecases.ioc.tokens';
import { GetAllTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/get-all-todos.v1.usecase.port';
import { ObjectId } from 'bson';
import { LoggerService } from '@shared/services/logger.service';

describe('FEATURE: List all TODOs via HTTP', () => {
  let controller: GetAllTodosV1Controller;
  let mockUsecase: jest.Mocked<GetAllTodosV1UsecasePort>;

  const mockTodos = [
    {
      _id: new ObjectId(),
      title: 'Test Todo 1',
      description: 'Test Description 1',
      completed: false,
      due_date: new Date(),
      priority: 'medium',
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      _id: new ObjectId(),
      title: 'Test Todo 2',
      description: 'Test Description 2',
      completed: true,
      due_date: new Date(),
      priority: 'high',
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const mockPaginatedResult: any = {
    data: mockTodos,
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  beforeEach(async () => {
    mockUsecase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllTodosV1Controller],
      providers: [
        {
          provide: GET_ALL_TODOS_V1_USECASE_TOKEN,
          useValue: mockUsecase,
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetAllTodosV1Controller>(GetAllTodosV1Controller);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SCENARIO: Initialize GetAllTodosV1Controller', () => {
    describe('GIVEN: Usecase is properly injected', () => {
      it('THEN: should be defined', () => {
        expect(controller).toBeDefined();
      });

      it('THEN: should inject usecase correctly', () => {
        expect(mockUsecase).toBeDefined();
      });
    });
  });

  describe('SCENARIO: List TODOs successfully via HTTP', () => {
    const mockRequest: any = {
      headers: {},
      method: 'GET',
      url: '/v1/todos',
      originalUrl: '/v1/todos',
      params: {},
      query: {},
      ip: '127.0.0.1',
      socket: {} as any,
    };

    describe('GIVEN: Valid request is provided', () => {
      beforeEach(() => {
        mockUsecase.execute.mockResolvedValue(mockPaginatedResult);
      });

      it('THEN: should return paginated todos successfully', async () => {
        const result = await controller.controller(mockRequest);

        expect(result).toEqual(mockPaginatedResult);
        expect(mockUsecase.execute).toHaveBeenCalled();
      });
    });

    describe('GIVEN: Request with OData query parameters', () => {
      const requestWithOData = {
        ...mockRequest,
        query: {
          $filter: "priority eq 'high'",
          $top: '5',
          $skip: '0',
        },
      };

      beforeEach(() => {
        mockUsecase.execute.mockResolvedValue(mockPaginatedResult);
      });

      it('THEN: should handle OData query parameters', async () => {
        const result = await controller.controller(requestWithOData);

        expect(result).toEqual(mockPaginatedResult);
        expect(mockUsecase.execute).toHaveBeenCalled();
      });
    });

    describe('GIVEN: Request with pagination parameters', () => {
      const requestWithPagination = {
        ...mockRequest,
        query: {
          $top: '1',
          $skip: '0',
        },
      };

      const paginatedResult: any = {
        data: mockTodos.slice(0, 1),
        total: 2,
        page: 1,
        limit: 1,
        totalPages: 2,
      };

      beforeEach(() => {
        mockUsecase.execute.mockResolvedValue(paginatedResult);
      });

      it('THEN: should handle pagination parameters', async () => {
        const result: any = await controller.controller(requestWithPagination);

        expect(result).toEqual(paginatedResult);
        expect(result.data).toHaveLength(1);
        expect(result.totalPages).toBe(2);
      });
    });

    describe('GIVEN: Request with sorting parameters', () => {
      const requestWithSorting = {
        ...mockRequest,
        query: {
          $orderby: 'created_at desc',
        },
      };

      beforeEach(() => {
        mockUsecase.execute.mockResolvedValue(mockPaginatedResult);
      });

      it('THEN: should handle sorting parameters', async () => {
        const result = await controller.controller(requestWithSorting);

        expect(result).toEqual(mockPaginatedResult);
        expect(mockUsecase.execute).toHaveBeenCalled();
      });
    });

    describe('GIVEN: Request with field selection parameters', () => {
      const requestWithSelection = {
        ...mockRequest,
        query: {
          $select: 'title,completed',
        },
      };

      beforeEach(() => {
        mockUsecase.execute.mockResolvedValue(mockPaginatedResult);
      });

      it('THEN: should handle field selection parameters', async () => {
        const result = await controller.controller(requestWithSelection);

        expect(result).toEqual(mockPaginatedResult);
        expect(mockUsecase.execute).toHaveBeenCalled();
      });
    });

    describe('GIVEN: Repository returns empty result', () => {
      const emptyResult: any = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      beforeEach(() => {
        mockUsecase.execute.mockResolvedValue(emptyResult);
      });

      it('THEN: should handle empty result', async () => {
        const result: any = await controller.controller(mockRequest);

        expect(result).toEqual(emptyResult);
        expect(result.data).toHaveLength(0);
        expect(result.total).toBe(0);
      });
    });
  });

  describe('SCENARIO: Usecase errors occur', () => {
    const mockRequest: any = {
      headers: {},
      method: 'GET',
      url: '/v1/todos',
      originalUrl: '/v1/todos',
      params: {},
      query: {},
      ip: '127.0.0.1',
      socket: {} as any,
    };

    describe('GIVEN: Usecase throws database error', () => {
      beforeEach(() => {
        const error = new Error('Database error');
        mockUsecase.execute.mockRejectedValue(error);
      });

      it('THEN: should handle usecase errors', async () => {
        await expect(controller.controller(mockRequest)).rejects.toThrow('Database error');
        expect(mockUsecase.execute).toHaveBeenCalled();
      });
    });

    describe('GIVEN: Usecase returns null', () => {
      beforeEach(() => {
        mockUsecase.execute.mockResolvedValue(null as any);
      });

      it('THEN: should handle usecase returning null', async () => {
        const result = await controller.controller(mockRequest);

        expect(result).toBeNull();
        expect(mockUsecase.execute).toHaveBeenCalled();
      });
    });

    describe('GIVEN: Usecase returns undefined', () => {
      beforeEach(() => {
        mockUsecase.execute.mockResolvedValue(undefined as any);
      });

      it('THEN: should handle usecase returning undefined', async () => {
        const result = await controller.controller(mockRequest);

        expect(result).toBeUndefined();
        expect(mockUsecase.execute).toHaveBeenCalled();
      });
    });
  });

  describe('SCENARIO: HTTP decorators are configured', () => {
    describe('GIVEN: Controller has route decorator', () => {
      it('THEN: should have correct route decorator', () => {
        const metadata = Reflect.getMetadata('path', GetAllTodosV1Controller);
        expect(metadata).toBe('/v1/todos');
      });
    });

    describe('GIVEN: Controller method has HTTP method decorator', () => {
      it('THEN: should have correct HTTP method decorator', () => {
        const methodMetadata = Reflect.getMetadata('method', controller.controller);
        expect(methodMetadata).toBe(0); // GET method is represented as 0
      });
    });

    describe('GIVEN: Controller method has HTTP code decorator', () => {
      it('THEN: should have correct HTTP code decorator', () => {
        const httpCodeMetadata = Reflect.getMetadata('__httpCode__', controller.controller);
        expect(httpCodeMetadata).toBe(200);
      });
    });
  });
});
