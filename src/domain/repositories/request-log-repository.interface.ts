import { RequestLog } from '../entities/request-log.entity';

export interface RequestLogRepository {
  save(requestLog: RequestLog): Promise<void>;
  findAll(): Promise<RequestLog[]>;
  findByFranchise(franchise: string): Promise<RequestLog[]>;
}
