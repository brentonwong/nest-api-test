import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { CreateOrPutTaskDTO } from 'src/models';

const MOCK_TASK = {
  id: '1cf24cca-b230-4832-92a2-028a8bfc2b3c',
  accountId: 1,
  scheduleId: 'a7e62848-1c59-443a-ad38-b8d4f3b6d2c7',
  startTime: '2024-06-25T10:00:00.000Z',
  duration: 2,
  type: 'work',
  createdAt: '2024-06-25T01:54:34.619Z',
  updatedAt: '2024-06-25T02:16:18.873Z',
  deletedAt: '2024-06-25T02:04:07.645Z',
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getTasks: jest.fn().mockResolvedValue([MOCK_TASK]),
            create: jest.fn().mockResolvedValue(MOCK_TASK),
            getTask: jest.fn().mockResolvedValue(MOCK_TASK),
            deleteTask: jest.fn().mockResolvedValue(null),
            putTask: jest.fn().mockResolvedValue(MOCK_TASK),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get - should return an array of tasks', async () => {
    await expect(controller.get()).resolves.toEqual([MOCK_TASK]);
    expect(service.getTasks).toHaveBeenCalled();
  });

  it('post - should create a new task', async () => {
    const dto: CreateOrPutTaskDTO = {
      accountId: 1,
      scheduleId: 'a7e62848-1c59-443a-ad38-b8d4f3b6d2c7',
      startTime: '2024-06-25T10:00:00Z',
      duration: 1,
      type: 'work',
    };
    await expect(controller.post(dto)).resolves.toEqual(MOCK_TASK);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('getById - should return a single task by id', async () => {
    const idParam = { id: '1' };
    await expect(controller.getById(idParam)).resolves.toEqual(MOCK_TASK);
    expect(service.getTask).toHaveBeenCalledWith(idParam.id);
  });

  it('delete - should delete a task by id', async () => {
    const idParam = { id: '1' };
    await expect(controller.delete(idParam)).resolves.toEqual(null);
    expect(service.deleteTask).toHaveBeenCalledWith(idParam.id);
  });

  it('put - should update a task by id', async () => {
    const idParam = { id: '1cf24cca-b230-4832-92a2-028a8bfc2b3c' };
    const dto: CreateOrPutTaskDTO = {
      accountId: 1,
      scheduleId: 'a7e62848-1c59-443a-ad38-b8d4f3b6d2c7',
      startTime: '2024-06-25T10:00:00Z',
      duration: 1,
      type: 'work',
    };
    await expect(controller.put(idParam, dto)).resolves.toEqual(MOCK_TASK);
    expect(service.putTask).toHaveBeenCalledWith(idParam.id, dto);
  });
});
