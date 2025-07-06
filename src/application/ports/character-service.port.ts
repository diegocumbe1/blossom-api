import { Character } from '../../domain/entities/character.entity';
import { Metadata } from '../../domain/value-objects/metadata.vo';
import { Config } from '../../domain/value-objects/config.vo';
import { Franchise } from '../../shared/enums';

export interface CharacterServicePort {
  getCharacter(
    franchise: Franchise,
    version: string,
    metadata: Metadata,
    config: Config,
  ): Promise<Character>;
}
