import { ConfigService } from '@nestjs/config';

export const API_CONFIG = {
  POKEMON: {
    name: 'Pokemon API',
  },
  DIGIMON: {
    name: 'Digimon API',
  },
} as const;

export const getDefaultConfig = (
  franchise: string,
  configService: ConfigService,
) => {
  switch (franchise.toLowerCase()) {
    case 'pokemon':
      return {
        baseUrl:
          configService.get<string>('POKEMON_API_BASE_URL') ||
          'https://pokeapi.co/api/v2',
        name: API_CONFIG.POKEMON.name,
      };
    case 'digimon':
      return {
        baseUrl:
          configService.get<string>('DIGIMON_API_BASE_URL') ||
          'https://digi-api.com/api/v1',
        name: API_CONFIG.DIGIMON.name,
      };
    default:
      throw new Error(`Unsupported franchise: ${franchise}`);
  }
};
