import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { ExternalApiAdapter } from '../../infrastructure/adapters/external-apis/external-api.adapter';
import { RequestLogService } from './request-log.service';
import { Franchise, RequestStatus } from '../../shared/enums';
import { Metadata } from '../../domain/value-objects/metadata.vo';
import { Config } from '../../domain/value-objects/config.vo';

describe('CharacterService', () => {
  let service: CharacterService;
  let externalApiAdapter: ExternalApiAdapter;
  let requestLogService: RequestLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        {
          provide: ExternalApiAdapter,
          useValue: { fetchCharacter: jest.fn() },
        },
        {
          provide: RequestLogService,
          useValue: { saveRequestLog: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    externalApiAdapter = module.get<ExternalApiAdapter>(ExternalApiAdapter);
    requestLogService = module.get<RequestLogService>(RequestLogService);
  });

  it('should return character and log success', async () => {
    const mockCharacter = { name: 'pikachu', powers: [], evolutions: [] };
    (externalApiAdapter.fetchCharacter as jest.Mock).mockResolvedValue(
      mockCharacter,
    );

    const result = await service.getCharacter(
      Franchise.POKEMON,
      'v1',
      { name: 'pikachu' } as Metadata,
      { baseUrl: 'https://pokeapi.co/api/v2' } as Config,
    );

    expect(result).toEqual(mockCharacter);
    expect(requestLogService.saveRequestLog).toHaveBeenCalledWith(
      expect.objectContaining({ status: RequestStatus.SUCCESS }),
    );
  });

  it('should log fail on error', async () => {
    (externalApiAdapter.fetchCharacter as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );

    await expect(
      service.getCharacter(
        Franchise.POKEMON,
        'v1',
        { name: 'pikachu' } as Metadata,
        { baseUrl: 'https://pokeapi.co/api/v2' } as Config,
      ),
    ).rejects.toThrow('fail');

    expect(requestLogService.saveRequestLog).toHaveBeenCalledWith(
      expect.objectContaining({ status: RequestStatus.FAIL }),
    );
  });
});
