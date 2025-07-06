import axios from 'axios';
import { Character } from 'src/domain/entities/character.entity';
import { Config } from 'src/domain/value-objects/config.vo';
import { Metadata } from 'src/domain/value-objects/metadata.vo';

interface PokemonApiResponse {
  id: number;
  name: string;
  weight: number;
  height: number;
  base_experience: number;
  abilities: {
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }[];
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }[];
  species: { name: string; url: string };
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': { front_default: string };
    };
  };
  moves: {
    move: { name: string; url: string };
    version_group_details: any[];
  }[];
}

interface PokemonSpeciesResponse {
  evolution_chain: { url: string };
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
  genera: {
    genus: string;
    language: { name: string };
  }[];
}

interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
  evolution_details: {
    min_level: number;
    trigger: { name: string };
  }[];
}

export default class PokemonApiAdapter {
  async fetchCharacter(metadata: Metadata, config: Config): Promise<Character> {
    if (!metadata.name) {
      throw new Error('Pokemon name is required in metadata');
    }
    if (!config.baseUrl) {
      throw new Error('baseUrl is required in config');
    }

    try {
      console.log(`Fetching Pokemon data for: ${metadata.name}`);

      // Consulta principal a la API de Pokémon
      const response = await axios.get<PokemonApiResponse>(
        `${config.baseUrl}/pokemon/${metadata.name.toLowerCase()}`,
      );
      const data = response.data;

      console.log(`Pokemon data received: ${data.name}, ID: ${data.id}`);

      // Extraer poderes (abilities + types + moves)
      const powers: string[] = [];

      // Agregar abilities
      data.abilities.forEach((ability) => {
        powers.push(
          `${ability.ability.name}${ability.is_hidden ? ' (Hidden)' : ''}`,
        );
      });

      // Agregar types
      data.types.forEach((type) => {
        powers.push(`Type: ${type.type.name}`);
      });

      // Agregar algunos moves principales (primeros 5)
      const mainMoves = data.moves.slice(0, 5).map((move) => move.move.name);
      powers.push(...mainMoves.map((move) => `Move: ${move}`));

      // Consulta para obtener evoluciones
      let evolutions: string[] = [];
      try {
        console.log('Fetching species data for evolutions...');
        const speciesRes = await axios.get<PokemonSpeciesResponse>(
          data.species.url,
        );

        if (speciesRes.data.evolution_chain?.url) {
          console.log('Fetching evolution chain...');
          const evoRes = await axios.get<{ chain: EvolutionChain }>(
            speciesRes.data.evolution_chain.url,
          );
          evolutions = this.extractEvolutions(evoRes.data.chain);
          console.log(`Evolutions found: ${evolutions.join(', ')}`);
        }
      } catch (evoError) {
        console.log('Could not fetch evolutions:', evoError);
        evolutions = [];
      }

      const character: Character = {
        name: data.name,
        weight: data.weight,
        powers,
        evolutions,
      };

      console.log(`Character created successfully: ${character.name}`);
      return character;
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Pokemon '${metadata.name}' not found`);
        } else if (error.response) {
          throw new Error(
            `Pokemon API error (${error.response.status}): ${JSON.stringify(
              error.response.data,
            )}`,
          );
        } else if (error.request) {
          throw new Error('No response from Pokemon API');
        } else {
          throw new Error(`Axios error: ${error.message}`);
        }
      }
      throw new Error(`Unknown error: ${String(error)}`);
    }
  }

  private extractEvolutions(chain: EvolutionChain): string[] {
    const evolutions: string[] = [];
    let current: EvolutionChain | undefined = chain;

    while (current) {
      evolutions.push(current.species.name);
      if (current.evolves_to && current.evolves_to.length > 0) {
        current = current.evolves_to[0];
      } else {
        break;
      }
    }

    return evolutions;
  }
}
