import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigValidator {
  private readonly logger = new Logger(ConfigValidator.name);

  constructor(private readonly configService: ConfigService) {}

  validateApiConfig(): void {
    const pokemonUrl = this.configService.get<string>('POKEMON_API_BASE_URL');
    const digimonUrl = this.configService.get<string>('DIGIMON_API_BASE_URL');

    this.logger.log('=== API Configuration Validation ===');
    this.logger.log(`Pokemon API URL: ${pokemonUrl || 'Using default'}`);
    this.logger.log(`Digimon API URL: ${digimonUrl || 'Using default'}`);
    this.logger.log('=====================================');

    if (!pokemonUrl) {
      this.logger.warn(
        'POKEMON_API_BASE_URL not set, using default: https://pokeapi.co/api/v2',
      );
    }
    if (!digimonUrl) {
      this.logger.warn(
        'DIGIMON_API_BASE_URL not set, using default: https://digi-api.com/api/v1',
      );
    }
  }

  getPokemonApiUrl(): string {
    return (
      this.configService.get<string>('POKEMON_API_BASE_URL') ||
      'https://pokeapi.co/api/v2'
    );
  }

  getDigimonApiUrl(): string {
    return (
      this.configService.get<string>('DIGIMON_API_BASE_URL') ||
      'https://digi-api.com/api/v1'
    );
  }
}
