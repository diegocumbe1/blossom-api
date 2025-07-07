import { RequestLogEntity } from 'src/infrastructure/adapters/database/request-log.entity';

export interface RequestLogRepository {
  save(log: Partial<RequestLogEntity>): Promise<RequestLogEntity>;
  findAll(): Promise<RequestLogEntity[]>;
}
