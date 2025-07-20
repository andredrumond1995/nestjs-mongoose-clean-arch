import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodosV1Usecase } from '../create-todos.v1.usecase';
import { getModelToken } from '@nestjs/mongoose';
import { TODOS_REPOSITORY_TOKEN } from '@todos/infrastructure/module/ioc-tokens/repositories/todos-repositories.ioc.tokens';
import { TODOS_SERVICE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/services/todos-service.ioc.tokens';
import { UNIT_OF_WORK_TOKEN } from '@shared/infrastructure/modules/unit-of-work/ioc-tokens/unit-of-work.ioc.tokens';
import { ModuleRef } from '@nestjs/core';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import { TODOS_MONGODB_COLLECTION_NAME } from '@todos/infrastructure/constants/todos-mongodb.constants';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
import { ObjectId } from 'bson';
import { ICreateUsecaseParams } from '@shared/application/types/usecases.types';

describe('FEATURE: Create TODO', () => {
  let usecase: CreateTodosV1Usecase;
  let mockModel: any;
  let mockRepository: any;
  let mockService: any;
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
      create: jest.fn(),
    };

    mockRepository = {
      setModel: jest.fn(),
      create: jest.fn(),
    };

    mockService = {
      validateUniqueInput: jest.fn(),
      getAll: jest.fn().mockResolvedValue([]),
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
        CreateTodosV1Usecase,
        {
          provide: getModelToken(TODOS_MONGODB_COLLECTION_NAME, MONGODB_DATABASE_NAME),
          useValue: mockModel,
        },
        {
          provide: TODOS_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: TODOS_SERVICE_TOKEN,
          useValue: mockService,
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

    usecase = module.get<CreateTodosV1Usecase>(CreateTodosV1Usecase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SCENARIO: Initialize CreateTodosV1Usecase', () => {
    describe('GIVEN: All dependencies are properly injected', () => {
      it('THEN: should be defined', () => {
        expect(usecase).toBeDefined();
      });

      it('THEN: should set unique input fields', () => {
        expect(usecase.uniqueInputFields).toEqual(['title']);
      });

      it('THEN: should set model on repository', () => {
        expect(mockRepository.setModel).toHaveBeenCalledWith(mockModel);
      });
    });
  });

  describe('SCENARIO: Create TODO successfully', () => {
    const mockInput = {
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      due_date: new Date(),
      priority: 'medium' as const,
    };

    const mockParams: ICreateUsecaseParams<TodoEntity> = {
      input: mockInput as any,
      request: {} as any,
    };

    describe('GIVEN: Valid input data is provided', () => {
      beforeEach(() => {
        const validatedInput = { ...mockInput, _id: mockTodo._id };
        mockService.validateUniqueInput = jest.fn().mockResolvedValue(true);
        mockRepository.create = jest.fn().mockResolvedValue(validatedInput);
      });

      it('THEN: should validate input and create todo successfully', async () => {
        const validatedInput = { ...mockInput, _id: mockTodo._id };
        const result = await usecase.execute(mockParams);

        expect(result).toEqual(validatedInput);
        expect(mockRepository.create).toHaveBeenCalled();
      });
    });

    describe('GIVEN: Input with only required fields', () => {
      const minimalInput = {
        title: 'Test Todo',
        completed: false,
      };
      const minimalParams: ICreateUsecaseParams<TodoEntity> = { ...mockParams, input: minimalInput as any };

      beforeEach(() => {
        const expectedResult = { ...minimalInput, _id: mockTodo._id };
        mockRepository.create = jest.fn().mockResolvedValue(expectedResult);
      });

      it('THEN: should handle optional fields correctly', async () => {
        const expectedResult = { ...minimalInput, _id: mockTodo._id };
        const result = await usecase.execute(minimalParams);

        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('SCENARIO: Validation fails', () => {
    const mockInput = {
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      due_date: new Date(),
      priority: 'medium' as const,
    };

    const mockParams: ICreateUsecaseParams<TodoEntity> = {
      input: mockInput as any,
      request: {} as any,
    };

    describe('GIVEN: Title is empty string', () => {
      const invalidInput = { ...mockInput, title: '' };
      const invalidParams: ICreateUsecaseParams<TodoEntity> = { ...mockParams, input: invalidInput as any };

      it('THEN: should throw error when validation fails', async () => {
        await expect(usecase.execute(invalidParams)).rejects.toThrow();
      });
    });

    describe('GIVEN: Title field is missing', () => {
      const inputWithoutTitle = {
        description: 'Test Description',
        completed: false,
      };
      const paramsWithoutTitle: ICreateUsecaseParams<TodoEntity> = { ...mockParams, input: inputWithoutTitle as any };

      it('THEN: should validate required fields', async () => {
        await expect(usecase.execute(paramsWithoutTitle)).rejects.toThrow();
      });
    });

    describe('GIVEN: Priority has invalid value', () => {
      const invalidPriorityInput = {
        ...mockInput,
        priority: 'invalid' as any,
      };
      const invalidPriorityParams: ICreateUsecaseParams<TodoEntity> = {
        ...mockParams,
        input: invalidPriorityInput as any,
      };

      it('THEN: should validate priority enum values', async () => {
        await expect(usecase.execute(invalidPriorityParams)).rejects.toThrow();
      });
    });

    describe('GIVEN: Due date has invalid format', () => {
      const invalidDateInput = {
        ...mockInput,
        due_date: 'invalid-date' as any,
      };
      const invalidDateParams: ICreateUsecaseParams<TodoEntity> = { ...mockParams, input: invalidDateInput as any };

      it('THEN: should validate date format for due_date', async () => {
        await expect(usecase.execute(invalidDateParams)).rejects.toThrow();
      });
    });
  });

  describe('SCENARIO: Repository errors occur', () => {
    const mockInput = {
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      due_date: new Date(),
      priority: 'medium' as const,
    };

    const mockParams: ICreateUsecaseParams<TodoEntity> = {
      input: mockInput as any,
      request: {} as any,
    };

    describe('GIVEN: Repository throws database error', () => {
      beforeEach(() => {
        const error = new Error('Database error');
        mockRepository.create = jest.fn().mockRejectedValue(error);
      });

      it('THEN: should handle repository errors', async () => {
        await expect(usecase.execute(mockParams)).rejects.toThrow('Database error');
      });
    });
  });

  describe('SCENARIO: Input validation with different priority values', () => {
    describe('GIVEN: Valid priority values are provided', () => {
      const validPriorities = ['low', 'medium', 'high'];

      validPriorities.forEach((priority) => {
        describe(`GIVEN: Priority is "${priority}"`, () => {
          it('THEN: should accept valid priority values', () => {
            const input = {
              title: 'Test Todo',
              completed: false,
              priority: priority as any,
            };

            expect(() => TodoEntity.validateCreate(input)).not.toThrow();
          });
        });
      });
    });

    describe('GIVEN: Invalid priority value is provided', () => {
      it('THEN: should reject invalid priority values', () => {
        const input = {
          title: 'Test Todo',
          completed: false,
          priority: 'invalid' as any,
        };

        expect(() => TodoEntity.validateCreate(input)).toThrow();
      });
    });
  });

  describe('SCENARIO: Required field validation', () => {
    describe('GIVEN: Title field is missing', () => {
      it('THEN: should require title field', () => {
        const input = {
          completed: false,
        };

        expect(() => TodoEntity.validateCreate(input)).toThrow();
      });
    });

    describe('GIVEN: Completed field is missing', () => {
      it('THEN: should use default value for completed field', () => {
        const input = {
          title: 'Test Todo',
        };

        const result = TodoEntity.validateCreate(input) as any;
        expect(result.completed).toBe(false);
      });
    });
  });
});
