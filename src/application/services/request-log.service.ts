import { Injectable, Inject } from '@nestjs/common';
import { RequestLogEntity } from 'src/infrastructure/adapters/database/request-log.entity';
import { RequestLogRepository } from 'src/domain/repositories/request-log-repository.interface';
import { Franchise } from '../../shared/enums';

@Injectable()
export class RequestLogService {
  constructor(
    @Inject('RequestLogRepository')
    private readonly repo: RequestLogRepository,
  ) {}

  async saveRequestLog(
    log: Partial<RequestLogEntity>,
  ): Promise<RequestLogEntity> {
    return this.repo.save(log);
  }

  async getAllLogs(): Promise<RequestLogEntity[]> {
    return this.repo.findAll();
  }

  async getRequestLogsByFranchise(
    franchise: Franchise,
  ): Promise<RequestLogEntity[]> {
    const all = await this.repo.findAll();
    return all.filter((log) => log.franchise === franchise);
  }
}
