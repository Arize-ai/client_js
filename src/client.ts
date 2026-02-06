import createOpenApiClient, { ClientOptions } from "openapi-fetch";
import { paths } from "./__generated__/api/v2";

const DEFAULT_BASE_URL = "https://api.arize.com";

interface ArizeClientOptions {
  /**
   * @default process.env['ARIZE_API_KEY']
   * Can be overriden by passing an apiKey option.
   */
  apiKey?: string;

  /**
   * @default process.env['ARIZE_BASE_URL']
   * If not set, falls back to "https://api.arize.com".
   * Can be overridden by passing a baseUrl option.
   */
  baseUrl?: string;

  /**
   * Default headers to include with every request to the API.
   */
  defaultHeaders?: Record<string, string>;

  /**
   * The function to use to get the environment options. By default, a function that
   * returns `process.env` is used.
   */
  getEnvironmentOptions?: () => Omit<
    ArizeClientOptions,
    "getEnvironmentOptions"
  >;
}

/**
 * Get the environment options from the process.env.
 *
 * @returns The environment options as an ArizeClientOptions object.
 */
const getDefaultEnvironmentOptions = (): ArizeClientOptions => {
  if (typeof process !== "object" || typeof process.env !== "object") {
    return {};
  }

  const config: ArizeClientOptions = {};

  if (process.env.ARIZE_API_KEY) {
    config.apiKey = process.env.ARIZE_API_KEY;
  }

  if (process.env.ARIZE_BASE_URL) {
    config.baseUrl = process.env.ARIZE_BASE_URL;
  }

  return config;
};

export const getMergedOptions = (config?: ArizeClientOptions) => {
  const { getEnvironmentOptions = getDefaultEnvironmentOptions, ...options } =
    config || {};
  const environmentOptions = getEnvironmentOptions();
  return {
    ...environmentOptions,
    ...options,
  };
};

/**
 * Converts ArizeClientOptions to ClientOptions for the OpenAPI client.
 *
 * @param mergedOptions - The merged ArizeClientOptions.
 * @returns The ClientOptions for the OpenAPI client.
 */
const arizeConfigToClientOptions = (
  mergedOptions: Omit<ArizeClientOptions, "apiKey"> & { apiKey: string },
): ClientOptions => {
  const options: ClientOptions = {
    baseUrl: mergedOptions.baseUrl || DEFAULT_BASE_URL,
    headers: {
      ...mergedOptions.defaultHeaders,
      Authorization: `Bearer ${mergedOptions.apiKey}`,
    },
  };
  return options;
};

/**
 * Creates an Arize client.
 *
 * @param config - The configuration to use for the client.
 * @returns The configured Arize client.
 */
export function createClient(config?: ArizeClientOptions) {
  const mergedOptions = getMergedOptions(config);
  if (mergedOptions.apiKey === undefined) {
    throw new Error(
      "The ARIZE_API_KEY environment variable is missing or empty; either provide it, or create the Arize client with an apiKey option, like createClient({ apiKey: 'My API Key' }).",
    );
  }
  const options = {
    ...mergedOptions,
    apiKey: mergedOptions.apiKey,
  };
  const clientOptions = arizeConfigToClientOptions(options);
  return createOpenApiClient<paths>(clientOptions);
}
