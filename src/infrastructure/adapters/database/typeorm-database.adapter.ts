import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
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

  async getAllRequestLogs(): Promise<RequestLogEntity[]> {
    return this.requestLogRepo.find();
  }

  async getRequestLogsByFranchise(
    franchise: Franchise,
  ): Promise<RequestLogEntity[]> {
    return this.requestLogRepo.find({ where: { franchise } });
  }

  async getLogsPaginatedAndFiltered(
    page: number,
    limit: number,
    filters: {
      franchise?: Franchise;
      status?: string;
      version?: string;
      fechaDesde?: Date;
      fechaHasta?: Date;
    },
  ): Promise<[RequestLogEntity[], number]> {
    const where: Record<string, unknown> = {};
    if (filters.franchise) where.franchise = filters.franchise;
    if (filters.status) where.status = filters.status;
    if (filters.version) where.version = Like(`%${filters.version}%`);
    if (filters.fechaDesde && filters.fechaHasta) {
      where.timestamp = Between(filters.fechaDesde, filters.fechaHasta);
    } else if (filters.fechaDesde) {
      where.timestamp = Between(filters.fechaDesde, new Date());
    }

    return this.requestLogRepo.findAndCount({
      where,
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  private toEntity(log: RequestLog): RequestLogEntity {
    return RequestLogEntity.from(log);
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
