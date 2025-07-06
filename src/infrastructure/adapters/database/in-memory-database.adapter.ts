import { Injectable } from '@nestjs/common';
import { RequestLog } from '../../../domain/entities/request-log.entity';
import { Franchise } from '../../../shared/enums';

@Injectable()
export class InMemoryDatabaseAdapter {
  private requestLogs: RequestLog[] = [];

  saveRequestLog(requestLog: RequestLog): void {
    this.requestLogs.push(requestLog);
    console.log('Request log saved:', requestLog);
  }

  getAllRequestLogs(): RequestLog[] {
    return this.requestLogs;
  }

  getRequestLogsByFranchise(franchise: Franchise): RequestLog[] {
    return this.requestLogs.filter((log) => log.franchise === franchise);
  }

  initialize(): void {
    console.log('In-memory database initialized');
  }

  close(): void {
    console.log('In-memory database closed');
  }
}
