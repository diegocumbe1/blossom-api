import { Injectable } from '@nestjs/common';
import { Character } from '../../domain/entities/character.entity';
import { Metadata } from '../../domain/value-objects/metadata.vo';
import { Config } from '../../domain/value-objects/config.vo';
import { Franchise, RequestStatus } from '../../shared/enums';
import { ExternalApiAdapter } from '../../infrastructure/adapters/external-apis/external-api.adapter';
import { RequestLogService } from './request-log.service';

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

      // Guardar log exitoso en la base de datos
      await this.requestLogService.saveRequestLog({
        franchise,
        version,
        metadata: JSON.stringify(metadata),
        timestamp: new Date(),
        status: RequestStatus.SUCCESS,
        errorMessage: undefined,
      });

      return character;
    } catch (error) {
      // Guardar log fallido en la base de datos
      await this.requestLogService.saveRequestLog({
        franchise,
        version,
        metadata: JSON.stringify(metadata),
        timestamp: new Date(),
        status: RequestStatus.FAIL,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
