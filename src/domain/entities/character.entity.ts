export type Character = {
  readonly name: string;
  readonly weight?: number;
  readonly powers: string[];
  readonly evolutions: string[];
};

export const createCharacter = (
  name: string,
  weight?: number,
  powers: string[] = [],
  evolutions: string[] = [],
): Character => ({
  name,
  weight,
  powers,
  evolutions,
});

export const characterToJSON = (character: Character) => ({
  name: character.name,
  weight: character.weight,
  powers: character.powers,
  evolutions: character.evolutions,
});
