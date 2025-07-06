import { RequestLog } from '../../domain/entities/request-log.entity';
import { Franchise } from '../../shared/enums';

export interface RequestLogServicePort {
  saveRequestLog(requestLog: RequestLog): Promise<void>;
  getAllRequestLogs(): Promise<RequestLog[]>;
  getRequestLogsByFranchise(franchise: Franchise): Promise<RequestLog[]>;
}
