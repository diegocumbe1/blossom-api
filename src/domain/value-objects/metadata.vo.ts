export type Metadata = {
  readonly name?: string;
  readonly id?: number;
};

export const createMetadataForPokemon = (name: string): Metadata => {
  if (!name) {
    throw new Error('Name is required for Pokemon metadata');
  }
  return { name };
};

export const createMetadataForDigimon = (id: number): Metadata => {
  if (!id) {
    throw new Error('ID is required for Digimon metadata');
  }
  return { id };
};

export const validateMetadata = (metadata: Metadata): void => {
  if (!metadata.name && !metadata.id) {
    throw new Error('Metadata must contain either name or id');
  }
};

export const metadataToJSON = (metadata: Metadata) => ({
  name: metadata.name,
  id: metadata.id,
});
