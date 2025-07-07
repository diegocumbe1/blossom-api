import { Test, TestingModule } from '@nestjs/testing';
import { LogQueryService } from './log-query.service';
import { TypeOrmDatabaseAdapter } from '../../infrastructure/adapters/database/typeorm-database.adapter';
import { Franchise, RequestStatus } from '../../shared/enums';
import { RequestLogEntity } from '../../infrastructure/adapters/database/request-log.entity';

describe('LogQueryService', () => {
  let service: LogQueryService;
  let db: TypeOrmDatabaseAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogQueryService,
        {
          provide: TypeOrmDatabaseAdapter,
          useValue: {
            getAllRequestLogs: jest.fn(),
            getRequestLogsByFranchise: jest.fn(),
            getLogsPaginatedAndFiltered: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LogQueryService>(LogQueryService);
    db = module.get<TypeOrmDatabaseAdapter>(TypeOrmDatabaseAdapter);
  });

  it('should get all logs', async () => {
    const entities = [
      Object.assign(new RequestLogEntity(), {
        franchise: Franchise.POKEMON,
        version: 'v1',
        metadata: '{}',
        timestamp: new Date(),
        status: RequestStatus.SUCCESS,
      }),
    ];
    (db.getAllRequestLogs as jest.Mock).mockResolvedValue(entities);
    const result = await service.getAllLogs();
    expect(result[0].franchise).toBe(Franchise.POKEMON);
    expect(db.getAllRequestLogs).toHaveBeenCalled();
  });

  it('should get logs by franchise', async () => {
    const entities = [
      Object.assign(new RequestLogEntity(), {
        franchise: Franchise.DIGIMON,
        version: 'v1',
        metadata: '{}',
        timestamp: new Date(),
        status: RequestStatus.SUCCESS,
      }),
    ];
    (db.getRequestLogsByFranchise as jest.Mock).mockResolvedValue(entities);
    const result = await service.getLogsByFranchise(Franchise.DIGIMON);
    expect(result[0].franchise).toBe(Franchise.DIGIMON);
    expect(db.getRequestLogsByFranchise).toHaveBeenCalledWith(
      Franchise.DIGIMON,
    );
  });

  it('should get paginated and filtered logs', async () => {
    const entities = [
      Object.assign(new RequestLogEntity(), {
        franchise: Franchise.POKEMON,
        version: 'v1',
        metadata: '{}',
        timestamp: new Date(),
        status: RequestStatus.SUCCESS,
      }),
    ];
    (db.getLogsPaginatedAndFiltered as jest.Mock).mockResolvedValue([
      entities,
      1,
    ]);
    const { data, total } = await service.getLogsPaginatedAndFiltered(1, 10, {
      franchise: Franchise.POKEMON,
    });
    expect(data[0].franchise).toBe(Franchise.POKEMON);
    expect(total).toBe(1);
    expect(db.getLogsPaginatedAndFiltered).toHaveBeenCalledWith(1, 10, {
      franchise: Franchise.POKEMON,
    });
  });
});
