import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

const MOCK_SCHEDULE = {
  id: 'a7e62848-1c59-443a-ad38-b8d4f3b6d2c7',
  accountId: 1,
  agentId: 1,
  startTime: '2024-06-25T09:00:00.000Z',
  endTime: '2024-06-25T17:00:00.000Z',
  createdAt: '2024-06-24T23:05:08.587Z',
  updatedAt: null,
  deletedAt: null,
};

describe('SchedulesController', () => {
  let controller: SchedulesController;
  let service: SchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        {
          provide: SchedulesService,
          useValue: {
            getSchedules: jest.fn().mockResolvedValue([MOCK_SCHEDULE]),
            getSchedule: jest.fn().mockResolvedValue(MOCK_SCHEDULE),
            createSchedule: jest.fn().mockResolvedValue(MOCK_SCHEDULE),
            deleteSchedule: jest.fn().mockResolvedValue(null),
            updateSchedule: jest.fn().mockResolvedValue(MOCK_SCHEDULE),
            createOrReplaceSchedule: jest.fn().mockResolvedValue(MOCK_SCHEDULE),
          },
        },
      ],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should return an array of schedules', async () => {
    expect(await controller.get()).toEqual([MOCK_SCHEDULE]);
    expect(service.getSchedules).toHaveBeenCalled();
  });

  it('should return a single schedule', async () => {
    expect(
      await controller.getById({ id: 'a7e62848-1c59-443a-ad38-b8d4f3b6d2c7' }),
    ).toEqual(MOCK_SCHEDULE);
    expect(service.getSchedule).toHaveBeenCalledWith(
      'a7e62848-1c59-443a-ad38-b8d4f3b6d2c7',
    );
  });

  it('should create a new schedule', async () => {
    const newScheduleDto = {
      accountId: 1,
      agentId: 1,
      startTime: '2024-06-25T09:00:00Z',
      endTime: '2024-06-25T17:00:00Z',
    };
    expect(await controller.post(newScheduleDto)).toEqual(MOCK_SCHEDULE);
    expect(service.createSchedule).toHaveBeenCalledWith(newScheduleDto);
  });

  it('should update a schedule', async () => {
    const updateScheduleDto = {
      accountId: 1,
      agentId: 1,
      startTime: '2024-06-25T09:00:00Z',
      endTime: '2024-06-25T17:00:00Z',
    };
    expect(
      await controller.patch(
        { id: 'a7e62848-1c59-443a-ad38-b8d4f3b6d2c7' },
        updateScheduleDto,
      ),
    ).toEqual(MOCK_SCHEDULE);
    expect(service.updateSchedule).toHaveBeenCalledWith(
      'a7e62848-1c59-443a-ad38-b8d4f3b6d2c7',
      updateScheduleDto,
    );
  });
});
