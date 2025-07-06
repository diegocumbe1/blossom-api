import { Character } from '../entities/character.entity';
import { Metadata } from '../value-objects/metadata.vo';
import { Config } from '../value-objects/config.vo';
import { Franchise } from '../../shared/enums';

export interface CharacterRepository {
  getCharacter(
    franchise: Franchise,
    version: string,
    metadata: Metadata,
    config: Config,
  ): Promise<Character>;
}
