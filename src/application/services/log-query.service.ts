import { Injectable } from '@nestjs/common';
import { Franchise } from '../../shared/enums';
import { TypeOrmDatabaseAdapter } from '../../infrastructure/adapters/database/typeorm-database.adapter';
import { RequestLog } from '../../domain/entities/request-log.entity';
import { RequestLogEntity } from '../../infrastructure/adapters/database/request-log.entity';

@Injectable()
export class LogQueryService {
  constructor(private readonly db: TypeOrmDatabaseAdapter) {}

  async getAllLogs(): Promise<RequestLog[]> {
    const entities = await this.db.getAllRequestLogs();
    return entities.map((e: RequestLogEntity) => e.toDomain());
  }

  async getLogsByFranchise(franchise: Franchise): Promise<RequestLog[]> {
    const entities = await this.db.getRequestLogsByFranchise(franchise);
    return entities.map((e: RequestLogEntity) => e.toDomain());
  }
}
