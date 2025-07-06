import { Injectable } from '@nestjs/common';
import { Character } from '../../domain/entities/character.entity';
import { Metadata } from '../../domain/value-objects/metadata.vo';
import { Config } from '../../domain/value-objects/config.vo';
import { Franchise, RequestStatus } from '../../shared/enums';
import { ExternalApiAdapter } from '../../infrastructure/adapters/external-apis/external-api.adapter';
import { RequestLogService } from './request-log.service';
import { createRequestLog } from '../../domain/entities/request-log.entity';

@Injectable()
export class CharacterService {
  constructor(
    private readonly externalApiAdapter: ExternalApiAdapter,
    private readonly requestLogService: RequestLogService,
  ) {}

  async getCharacter(
    franchise: Franchise,
    version: string,
    metadata: Metadata,
    config: Config,
  ): Promise<Character> {
    try {
      // Obtener el personaje de la API externa
      const character = await this.externalApiAdapter.fetchCharacter(
        franchise,
        metadata,
        config,
      );

      // Log del request exitoso
      const successLog = createRequestLog(
        franchise,
        version,
        metadata,
        RequestStatus.SUCCESS,
      );
      await this.requestLogService.saveRequestLog(successLog);

      return character;
    } catch (error) {
      // Log del request fallido
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const failLog = createRequestLog(
        franchise,
        version,
        metadata,
        RequestStatus.FAIL,
        errorMessage,
      );
      await this.requestLogService.saveRequestLog(failLog);

      // Re-lanzar el error para que sea manejado por el adaptador HTTP
      throw error;
    }
  }
}
