import { getMergedOptions } from "../client";

export interface GraphQLClientOptions {
  apiKey?: string;
  baseUrl?: string;
  graphqlPath?: string;
  defaultHeaders?: Record<string, string>;
}

export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
};

/**
 * Execute a GraphQL query against the Arize GraphQL API.
 */
export async function graphqlFetch<T>(
  options: GraphQLClientOptions,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const merged = getMergedOptions({
    apiKey: options.apiKey,
    baseUrl: options.baseUrl,
  });

  if (!merged.apiKey) {
    throw new Error(
      "The ARIZE_API_KEY environment variable is missing or empty; either provide it, or pass an apiKey option.",
    );
  }

  const baseUrl = options.baseUrl || "https://app.arize.com";
  const graphqlPath = options.graphqlPath || "/graphql";
  const url = `${baseUrl}${graphqlPath}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": merged.apiKey,
      ...options.defaultHeaders,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed with status ${response.status}: ${response.statusText}`,
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors && json.errors.length > 0) {
    const messages = json.errors.map((e) => e.message).join("; ");
    throw new Error(`GraphQL errors: ${messages}`);
  }

  if (!json.data) {
    throw new Error("GraphQL response contained no data");
  }

  return json.data;
}
