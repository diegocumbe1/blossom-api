import { Test, TestingModule } from '@nestjs/testing';
import { RequestLogService } from './request-log.service';
import { RequestLogRepository } from 'src/domain/repositories/request-log-repository.interface';
import { RequestLogEntity } from 'src/infrastructure/adapters/database/request-log.entity';
import { Franchise, RequestStatus } from '../../shared/enums';

describe('RequestLogService', () => {
  let service: RequestLogService;
  let repo: RequestLogRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestLogService,
        {
          provide: 'RequestLogRepository',
          useValue: {
            save: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestLogService>(RequestLogService);
    repo = module.get<RequestLogRepository>('RequestLogRepository');
  });

  it('should save a log', async () => {
    const log: Partial<RequestLogEntity> = {
      franchise: Franchise.POKEMON,
      version: 'v1',
      metadata: '{}',
      timestamp: new Date(),
      status: RequestStatus.SUCCESS,
    };
    (repo.save as jest.Mock).mockResolvedValue({ ...log, id: 1 });
    const result = await service.saveRequestLog(log);
    expect(result).toMatchObject(log);
    expect(repo.save).toHaveBeenCalledWith(log);
  });

  it('should get all logs', async () => {
    const logs = [
      {
        id: 1,
        franchise: Franchise.POKEMON,
        version: 'v1',
        metadata: '{}',
        timestamp: new Date(),
        status: RequestStatus.SUCCESS,
      },
    ];
    (repo.findAll as jest.Mock).mockResolvedValue(logs);
    const result = await service.getAllLogs();
    expect(result).toEqual(logs);
    expect(repo.findAll).toHaveBeenCalled();
  });
});
