import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLogEntity } from './request-log.entity';
import { RequestLogRepository } from 'src/domain/repositories/request-log-repository.interface';

@Injectable()
export class TypeOrmRequestLogRepository implements RequestLogRepository {
  constructor(
    @InjectRepository(RequestLogEntity)
    private readonly repo: Repository<RequestLogEntity>,
  ) {}

  async save(log: Partial<RequestLogEntity>): Promise<RequestLogEntity> {
    return this.repo.save(log);
  }

  async findAll(): Promise<RequestLogEntity[]> {
    return this.repo.find({ order: { timestamp: 'DESC' } });
  }
}
