import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Franchise, RequestStatus } from '../../../shared/enums';

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
}
