import { Injectable } from '@nestjs/common';
import { RequestLog } from '../../domain/entities/request-log.entity';
import { Franchise } from '../../shared/enums';
import { TypeOrmDatabaseAdapter } from 'src/infrastructure/adapters/database/typeorm-database.adapter';

@Injectable()
export class RequestLogService {
  constructor(private readonly databaseAdapter: TypeOrmDatabaseAdapter) {}

  async saveRequestLog(requestLog: RequestLog): Promise<void> {
    await this.databaseAdapter.saveRequestLog(requestLog);
  }

  async getAllRequestLogs(): Promise<RequestLog[]> {
    return await this.databaseAdapter.getAllRequestLogs();
  }

  async getRequestLogsByFranchise(franchise: Franchise): Promise<RequestLog[]> {
    return await this.databaseAdapter.getRequestLogsByFranchise(franchise);
  }
}
