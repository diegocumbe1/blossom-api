import axios from 'axios';
import { Character } from 'src/domain/entities/character.entity';
import { Config } from 'src/domain/value-objects/config.vo';
import { Metadata } from 'src/domain/value-objects/metadata.vo';

interface DigimonApiResponse {
  id: number;
  name: string;
  level: string;
  type: string;
  attribute: string;
  skills: { skill: string }[];
  evolutions: { digimon: string }[];
  priorEvolutions: { digimon: string }[];
  nextEvolutions: { digimon: string }[];
  images: {
    href: string;
    transparent: string;
  }[];
  descriptions: {
    origin: string;
    language: string;
    description: string;
  }[];
}

export default class DigimonApiAdapter {
  async fetchCharacter(metadata: Metadata, config: Config): Promise<Character> {
    if (typeof metadata.id !== 'number') {
      throw new Error('Digimon id is required in metadata');
    }
    if (!config.baseUrl) {
      throw new Error('baseUrl is required in config');
    }

    try {
      console.log(`Fetching Digimon data for ID: ${metadata.id}`);

      // Ajusta la URL según la API real de Digimon
      const url = `${config.baseUrl}/digimon/${metadata.id}`;
      const response = await axios.get<DigimonApiResponse>(url);
      const data = response.data;

      console.log(`Digimon data received: ${data.name}, ID: ${data.id}`);

      // Extraer poderes (skills + type + attribute)
      const powers: string[] = [];

      // Agregar skills
      if (data.skills && data.skills.length > 0) {
        data.skills.forEach((skill) => {
          powers.push(`Skill: ${skill.skill}`);
        });
      }

      // Agregar type y attribute
      if (data.type) {
        powers.push(`Type: ${data.type}`);
      }
      if (data.attribute) {
        powers.push(`Attribute: ${data.attribute}`);
      }
      if (data.level) {
        powers.push(`Level: ${data.level}`);
      }

      // Combinar todas las evoluciones (prior, current, next)
      const evolutions: string[] = [];

      // Agregar evoluciones previas
      if (data.priorEvolutions && data.priorEvolutions.length > 0) {
        data.priorEvolutions.forEach((evo) => {
          evolutions.push(`${evo.digimon} (Prior)`);
        });
      }

      // Agregar evoluciones actuales
      if (data.evolutions && data.evolutions.length > 0) {
        data.evolutions.forEach((evo) => {
          evolutions.push(evo.digimon);
        });
      }

      // Agregar evoluciones siguientes
      if (data.nextEvolutions && data.nextEvolutions.length > 0) {
        data.nextEvolutions.forEach((evo) => {
          evolutions.push(`${evo.digimon} (Next)`);
        });
      }

      console.log(`Evolutions found: ${evolutions.join(', ')}`);

      const character: Character = {
        name: data.name,
        powers,
        evolutions,
      };

      console.log(`Character created successfully: ${character.name}`);
      return character;
    } catch (error) {
      console.error('Error fetching Digimon data:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Digimon with ID ${metadata.id} not found`);
        } else if (error.response) {
          // Error de la API (404, 500, etc)
          throw new Error(
            `Digimon API error (${error.response.status}): ${JSON.stringify(
              error.response.data,
            )}`,
          );
        } else if (error.request) {
          // No hubo respuesta
          throw new Error('No response from Digimon API');
        } else {
          // Otro error
          throw new Error(`Axios error: ${error.message}`);
        }
      }
      throw new Error(`Unknown error: ${String(error)}`);
    }
  }
}
