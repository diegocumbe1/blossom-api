import { Franchise, RequestStatus } from '../../shared/enums';

export type RequestLog = {
  readonly franchise: Franchise;
  readonly version: string;
  readonly metadata: object;
  readonly timestamp: Date;
  readonly status: RequestStatus;
  readonly errorMessage?: string;
};

export const createRequestLog = (
  franchise: Franchise,
  version: string,
  metadata: object,
  status: RequestStatus,
  errorMessage?: string,
): RequestLog => ({
  franchise,
  version,
  metadata,
  timestamp: new Date(),
  status,
  errorMessage,
});

export const requestLogToJSON = (requestLog: RequestLog) => ({
  franchise: requestLog.franchise,
  version: requestLog.version,
  metadata: requestLog.metadata,
  timestamp: requestLog.timestamp,
  status: requestLog.status,
  errorMessage: requestLog.errorMessage,
});
