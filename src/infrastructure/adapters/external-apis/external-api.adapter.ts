import { ExternalApiAdapterPort } from 'src/application/ports/external-api-adapter.port';
import PokemonApiAdapter from './pokemon-api.adapter';
import DigimonApiAdapter from './digimon-api.adapter';
import { Franchise } from 'src/shared/enums';
import { Metadata } from 'src/domain/value-objects/metadata.vo';
import { Config } from 'src/domain/value-objects/config.vo';
import { Character } from 'src/domain/entities/character.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExternalApiAdapter implements ExternalApiAdapterPort {
  constructor(
    private readonly pokemonApiAdapter: PokemonApiAdapter,
    private readonly digimonApiAdapter: DigimonApiAdapter,
  ) {}

  async fetchCharacter(
    franchise: Franchise,
    metadata: Metadata,
    config: Config,
  ): Promise<Character> {
    switch (franchise) {
      case Franchise.POKEMON:
        return this.pokemonApiAdapter.fetchCharacter(metadata, config);
      case Franchise.DIGIMON:
        return this.digimonApiAdapter.fetchCharacter(metadata, config);
      default:
        // throw new Error(`Unsupported franchise: ${franchise}`);
        throw new Error(`Unsupported franchise: `);
    }
  }
}
