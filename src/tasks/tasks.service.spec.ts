import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaServiceMock = {
      task: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockImplementation((args) => {
          if (args.where.id === 'valid_id')
            return Promise.resolve({
              /* Mocked task object */
            });
          else return Promise.resolve(null);
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('getTasks should return an array of tasks', async () => {
    await expect(service.getTasks()).resolves.toBeInstanceOf(Array);
    expect(prismaService.task.findMany).toHaveBeenCalled();
  });

  it('getTask with valid ID should return a task', async () => {
    const validId = 'valid_id';
    await expect(service.getTask(validId)).resolves.toBeDefined();
    expect(prismaService.task.findUnique).toHaveBeenCalledWith({
      where: { id: validId },
    });
  });

  it('getTask with invalid ID should throw NotFoundException', async () => {
    const invalidId = 'invalid_id';
    await expect(service.getTask(invalidId)).rejects.toThrow(NotFoundException);
  });
});
