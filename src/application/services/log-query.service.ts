import { Injectable } from '@nestjs/common';
import { Franchise } from '../../shared/enums';
import { TypeOrmDatabaseAdapter } from '../../infrastructure/adapters/database/typeorm-database.adapter';
import { RequestLog } from '../../domain/entities/request-log.entity';

@Injectable()
export class LogQueryService {
  constructor(private readonly db: TypeOrmDatabaseAdapter) {}

  async getAllLogs(): Promise<RequestLog[]> {
    return this.db.getAllRequestLogs();
  }

  async getLogsByFranchise(franchise: Franchise): Promise<RequestLog[]> {
    return this.db.getRequestLogsByFranchise(franchise);
  }
}
