import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let prismaService: PrismaService;
  const findUniqueMock = jest.fn().mockImplementation((args) => {
    if (args.where.id === '1')
      return Promise.resolve({
        id: '1',
        name: 'Test Schedule',
        deletedAt: null,
      });
    else return Promise.resolve(null);
  });

  beforeEach(async () => {
    const prismaServiceMock = {
      schedule: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ id: '1', name: 'Test Schedule' }]),
        findUnique: findUniqueMock,
        update: jest.fn().mockImplementation((args) => {
          if (args.where.id === '1')
            return Promise.resolve({ ...args.data, id: '1' });
          else throw new Error('Schedule not found');
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('getAll should return an array of schedules', async () => {
    const results = await service.getSchedules();
    expect(results).toBeInstanceOf(Array);
    expect(results).toHaveLength(1);
    expect(prismaService.schedule.findMany).toHaveBeenCalled();
  });

  it('getById should return a schedule for a valid ID', async () => {
    const schedule = await service.getSchedule('1');
    expect(schedule).toBeDefined();
    expect(schedule.id).toBe('1');
    expect(prismaService.schedule.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('getById should throw NotFoundException for an invalid ID', async () => {
    await expect(service.getSchedule('invalid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('delete should mark a schedule as deleted for a valid ID', async () => {
    const schedule = await service.deleteSchedule('1');
    expect(schedule.deletedAt).toBeDefined();
    expect(prismaService.schedule.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('delete should throw BadRequestException if the schedule is already marked as deleted', async () => {
    findUniqueMock.mockResolvedValueOnce({
      id: '1',
      deletedAt: new Date(),
    });
    await expect(service.deleteSchedule('1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('delete should throw NotFoundException for an invalid ID', async () => {
    await expect(service.deleteSchedule('invalid')).rejects.toThrow(
      NotFoundException,
    );
  });
});
