import axios, { AxiosError } from 'axios';
import PokemonApiAdapter from '../pokemon-api.adapter';
import { Config } from 'src/domain/value-objects/config.vo';
import { Metadata } from 'src/domain/value-objects/metadata.vo';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokemonApiAdapter', () => {
  const adapter = new PokemonApiAdapter();
  const config: Config = { baseUrl: 'https://pokeapi.co/api/v2' };
  const metadata: Metadata = { name: 'pikachu' };

  it('should transform API response to Character', async () => {
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          name: 'pikachu',
          weight: 60,
          abilities: [
            { ability: { name: 'static' } },
            { ability: { name: 'lightning-rod' } },
          ],
          species: { url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
        },
      }),
    );
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          evolution_chain: {
            url: 'https://pokeapi.co/api/v2/evolution-chain/10/',
          },
        },
      }),
    );
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          chain: {
            species: { name: 'pichu' },
            evolves_to: [
              {
                species: { name: 'pikachu' },
                evolves_to: [
                  {
                    species: { name: 'raichu' },
                    evolves_to: [],
                  },
                ],
              },
            ],
          },
        },
      }),
    );
    console.log('Test: should transform API response to Character');
    console.log('Input:', { metadata, config });
    const result = await adapter.fetchCharacter(metadata, config);
    console.log('Output:', result);
    expect(result).toEqual({
      name: 'pikachu',
      weight: 60,
      powers: ['static', 'lightning-rod'],
      evolutions: ['pichu', 'pikachu', 'raichu'],
    });
  });

  it('should throw if name is missing', async () => {
    console.log('Test: should throw if name is missing');
    try {
      await adapter.fetchCharacter({}, config);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Caught error:', error.message);
        expect(error.message).toBe('Pokemon name is required in metadata');
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
      await adapter.fetchCharacter({ name: 'notapokemon' }, config);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Caught error:', error.message);
        expect(error.message).toBe("Pokemon 'notapokemon' not found");
      } else {
        throw error;
      }
    }
  });
});
