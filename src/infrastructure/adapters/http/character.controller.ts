import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CharacterService } from '../../../application/services/character.service';
import { Franchise } from '../../../shared/enums';
import { createConfig } from '../../../domain/value-objects/config.vo';
import {
  CharacterResponseDto,
  ConfigQueryDto,
  MetadataQueryDto,
} from 'src/shared/dto';
import {
  createMetadataForDigimon,
  createMetadataForPokemon,
  Metadata,
} from 'src/domain/value-objects/metadata.vo';
import { getDefaultConfig } from '../../config/api-config';

@ApiTags('Characters')
@Controller('api/characters')
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':franchise/:version')
  @ApiOperation({
    summary: 'Get character information',
    description:
      'Retrieve character data from Pokemon or Digimon APIs based on franchise and version.\n\n' +
      '⚠️ The metadata and config query parameters must be JSON-serialized strings.\n' +
      'Example: /api/characters/pokemon/v1?metadata={"name":"pikachu"}&config={"baseUrl":"https://pokeapi.co/api/v2"}',
  })
  @ApiParam({
    name: 'franchise',
    description: 'The franchise to query (pokemon or digimon)',
    example: 'pokemon',
    enum: ['pokemon', 'digimon'],
  })
  @ApiParam({
    name: 'version',
    description: 'The version of the API to use',
    example: 'v1',
  })
  @ApiQuery({
    name: 'metadata',
    description:
      'Character metadata (debe ser un string JSON válido):\n' +
      '- Para Pokémon: {"name":"pikachu"}\n' +
      '- Para Digimon: {"id":42}',
    type: String,
    example: '{"name":"pikachu"}',
    required: true,
  })
  @ApiQuery({
    name: 'config',
    description:
      'API configuration (debe ser un string JSON válido):\n' +
      '- Para Pokémon: {"baseUrl":"https://pokeapi.co/api/v2"}\n' +
      '- Para Digimon: {"baseUrl":"https://digi-api.com/api/v1"}\n' +
      'Si no se proporciona, se usará la configuración desde variables de entorno.',
    type: String,
    example: '{"baseUrl":"https://pokeapi.co/api/v2"}',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Character information retrieved successfully',
    type: CharacterResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid parameters provided',
  })
  @ApiNotFoundResponse({
    description: 'Character not found in the specified franchise',
  })
  async getCharacter(
    @Param('franchise') franchise: string,
    @Param('version') version: string,
    @Query('metadata') metadataQuery: string,
    @Query('config') configQuery?: string,
  ): Promise<CharacterResponseDto> {
    try {
      console.log(
        `Processing request for franchise: ${franchise}, version: ${version}`,
      );
      console.log(`Metadata query: ${metadataQuery}`);
      console.log(
        `Config query: ${configQuery || 'using environment variables'}`,
      );

      // Parse query parameters
      const metadata = JSON.parse(metadataQuery) as MetadataQueryDto;

      // Parse config or use environment variables
      let config: ConfigQueryDto;
      if (configQuery) {
        config = JSON.parse(configQuery) as ConfigQueryDto;
      } else {
        const defaultConfig = getDefaultConfig(franchise, this.configService);
        config = { baseUrl: defaultConfig.baseUrl };
        console.log(
          `Using environment config for ${franchise}: ${defaultConfig.baseUrl}`,
        );
      }

      // Validate franchise
      if (!Object.values(Franchise).includes(franchise as Franchise)) {
        throw new HttpException(
          `Invalid franchise: ${franchise}. Must be 'pokemon' or 'digimon'`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const franchiseEnum = franchise as Franchise;

      // Create metadata and config objects
      let metadataObj: Metadata;
      if (franchiseEnum === Franchise.POKEMON) {
        if (!metadata.name) {
          throw new HttpException(
            'Pokemon name is required in metadata',
            HttpStatus.BAD_REQUEST,
          );
        }
        metadataObj = createMetadataForPokemon(metadata.name);
        console.log(`Created Pokemon metadata for: ${metadata.name}`);
      } else {
        if (!metadata.id) {
          throw new HttpException(
            'Digimon id is required in metadata',
            HttpStatus.BAD_REQUEST,
          );
        }
        metadataObj = createMetadataForDigimon(metadata.id);
        console.log(`Created Digimon metadata for ID: ${metadata.id}`);
      }

      const configObj = createConfig(config.baseUrl, config.apiKey);
      console.log(`Using API base URL: ${configObj.baseUrl}`);

      // Get character from service
      const character = await this.characterService.getCharacter(
        franchiseEnum,
        version,
        metadataObj,
        configObj,
      );

      console.log(`Successfully retrieved character: ${character.name}`);
      return character;
    } catch (error) {
      // Log all errors for debugging and traceability
      console.error('Controller error:', error);

      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof SyntaxError) {
        throw new HttpException(
          'Invalid JSON in query parameters',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
