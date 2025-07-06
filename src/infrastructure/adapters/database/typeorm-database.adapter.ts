import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLogEntity } from './request-log.entity';
import { RequestLog } from '../../../domain/entities/request-log.entity';
import { Franchise } from '../../../shared/enums';
import { MetadataQueryDto } from 'src/shared/dto';

@Injectable()
export class TypeOrmDatabaseAdapter {
  constructor(
    @InjectRepository(RequestLogEntity)
    private readonly requestLogRepo: Repository<RequestLogEntity>,
  ) {}

  async saveRequestLog(requestLog: RequestLog): Promise<void> {
    const entity = this.toEntity(requestLog);
    await this.requestLogRepo.save(entity);
  }

  async getAllRequestLogs(): Promise<RequestLog[]> {
    const entities = await this.requestLogRepo.find();
    return entities.map((e) => this.toDomain(e));
  }

  async getRequestLogsByFranchise(franchise: Franchise): Promise<RequestLog[]> {
    const entities = await this.requestLogRepo.find({ where: { franchise } });
    return entities.map((e) => this.toDomain(e));
  }

  private toEntity(log: RequestLog): Omit<RequestLogEntity, 'id'> {
    return {
      franchise: log.franchise,
      version: log.version,
      metadata: JSON.stringify(log.metadata),
      timestamp: log.timestamp,
      status: log.status,
      errorMessage: log.errorMessage,
    };
  }

  private toDomain(entity: RequestLogEntity): RequestLog {
    return {
      franchise: entity.franchise,
      version: entity.version,
      metadata: JSON.parse(entity.metadata) as MetadataQueryDto,
      timestamp: new Date(entity.timestamp),
      status: entity.status,
      errorMessage: entity.errorMessage,
    };
  }
}
