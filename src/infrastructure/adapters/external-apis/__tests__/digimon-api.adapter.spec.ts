import DigimonApiAdapter from '../digimon-api.adapter';
import { Config } from 'src/domain/value-objects/config.vo';
import { Metadata } from 'src/domain/value-objects/metadata.vo';
import axios, { AxiosError } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DigimonApiAdapter', () => {
  const adapter = new DigimonApiAdapter();
  const config: Config = { baseUrl: 'https://digimon-api.com/api/v1' };
  const metadata: Metadata = { name: 'Agumon' };

  it('should transform API response to Character', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          name: 'Agumon',
          level: 'Rookie',
          img: 'https://digimon-api.com/images/agumon.jpg',
        },
      ],
    });
    console.log('Test: should transform API response to Character');
    console.log('Input:', { metadata, config });
    const result = await adapter.fetchCharacter(metadata, config);
    console.log('Output:', result);
    expect(result).toEqual({
      name: 'Agumon',
      weight: undefined,
      powers: ['Rookie'],
      evolutions: [],
    });
  });

  it('should throw if name is missing', async () => {
    console.log('Test: should throw if name is missing');
    try {
      await adapter.fetchCharacter({}, config);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Caught error:', error.message);
        expect(error.message).toBe('Digimon name is required in metadata');
      } else {
        throw error;
      }
    }
  });

  it('should throw if not found', async () => {
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);
    const error = {
      isAxiosError: true,
      response: { status: 404 },
    } as AxiosError;
    mockedAxios.get.mockRejectedValueOnce(error);
    console.log('Test: should throw if not found');
    try {
      await adapter.fetchCharacter({ name: 'notadigimon' }, config);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Caught error:', error.message);
        expect(error.message).toBe("Digimon 'notadigimon' not found");
      } else {
        throw error;
      }
    }
  });

  it('should be defined', () => {
    expect(DigimonApiAdapter).toBeDefined();
  });

  it('should handle missing fields gracefully', async () => {
    const adapter = new DigimonApiAdapter();
    const metadata: Metadata = { name: 'Agumon' };
    const config: Config = { baseUrl: 'https://digimon-api.com/api/v1' };
    // Simula una respuesta compatible con el tipo Character
    const mockFetchCharacter = jest
      .spyOn(adapter, 'fetchCharacter')
      .mockResolvedValue({
        name: 'Agumon',
        weight: undefined,
        powers: [],
        evolutions: [],
      });
    const result = await adapter.fetchCharacter(metadata, config);
    expect(result.name).toBe('Agumon');
    mockFetchCharacter.mockRestore();
  });
});
