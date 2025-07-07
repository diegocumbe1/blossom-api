import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Franchise, RequestStatus } from '../../../shared/enums';
import { RequestLog } from 'src/domain/entities/request-log.entity';

@Entity('request_logs')
export class RequestLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  franchise: Franchise;

  @Column({ type: 'varchar' })
  version: string;

  @Column({ type: 'text' })
  metadata: string; // Guardamos el objeto como JSON string

  @Column({ type: 'datetime' })
  timestamp: Date;

  @Column({ type: 'varchar' })
  status: RequestStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  static from(log: RequestLog): RequestLogEntity {
    const entity = new RequestLogEntity();
    entity.franchise = log.franchise;
    entity.version = log.version;
    entity.metadata = JSON.stringify(log.metadata);
    entity.timestamp = log.timestamp;
    entity.status = log.status;
    entity.errorMessage = log.errorMessage;
    return entity;
  }

  toDomain(): RequestLog {
    return {
      franchise: this.franchise,
      version: this.version,
      metadata: JSON.parse(this.metadata) as object,
      timestamp: this.timestamp,
      status: this.status,
      errorMessage: this.errorMessage,
    };
  }
}
