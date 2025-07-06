export type Config = {
  readonly baseUrl: string;
  readonly apiKey?: string;
  readonly headers?: Record<string, string>;
};

export const createConfig = (
  baseUrl: string,
  apiKey?: string,
  headers?: Record<string, string>,
): Config => {
  if (!baseUrl) {
    throw new Error('Config must contain a baseUrl');
  }
  return { baseUrl, apiKey, headers };
};

export const validateConfig = (config: Config): void => {
  if (!config.baseUrl) {
    throw new Error('Config must contain a baseUrl');
  }
};

export const configToJSON = (config: Config) => ({
  baseUrl: config.baseUrl,
  apiKey: config.apiKey,
  headers: config.headers,
});
