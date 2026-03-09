import { graphqlFetch, GraphQLClientOptions } from "../graphql";
import {
  GET_PROMPT_BY_NODE_ID,
  GET_PROMPT_BY_NAME,
} from "../graphql/queries/prompts";
import { PromptWithContent } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformGraphQLPrompt } from "./utils";
import { RawGraphQLPrompt } from "../types/internal";

type PromptByNameResponse = {
  node: {
    prompts: {
      edges: Array<{ node: RawGraphQLPrompt }>;
    };
  };
};

export type GetPromptContentParams = {
  /** GraphQL node ID of the prompt (base64-encoded Relay Global ID) */
  promptNodeId?: string;
  /** Prompt name for lookup (requires spaceNodeId) */
  promptName?: string;
  /** GraphQL node ID of the space (required when using promptName) */
  spaceNodeId?: string;
  /** Number of versions to include (default: 0 = no version history) */
  versionLimit?: number;
  /** Override API key */
  apiKey?: string;
  /** Override GraphQL base URL (default: https://app.arize.com) */
  baseUrl?: string;
};

/**
 * Get the full content of a prompt via the GraphQL API.
 *
 * @param promptNodeId - GraphQL node ID for direct lookup.
 * @param promptName - Prompt name for lookup by name (requires spaceNodeId).
 * @param spaceNodeId - Space node ID (required when using promptName).
 * @param versionLimit - Number of versions to include.
 * @param apiKey - Override API key.
 * @param baseUrl - Override GraphQL base URL.
 * @returns A {@link PromptWithContent} object with full prompt data.
 * @throws Error if the prompt cannot be found or the GraphQL request fails.
 * @example
 * ```typescript
 * import { getPromptContent } from "@arizeai/ax-client"
 *
 * const content = await getPromptContent({
 *   promptNodeId: "your_relay_node_id",
 *   versionLimit: 10,
 * });
 * console.log(content.name, content.messages);
 * ```
 */
export async function getPromptContent({
  promptNodeId,
  promptName,
  spaceNodeId,
  versionLimit,
  apiKey,
  baseUrl,
}: GetPromptContentParams): Promise<PromptWithContent> {
  warnPreRelease({ functionName: "getPromptContent" });

  const clientOptions: GraphQLClientOptions = {
    apiKey,
    baseUrl,
  };

  if (promptNodeId) {
    const data = await graphqlFetch<{ node: RawGraphQLPrompt }>(
      clientOptions,
      GET_PROMPT_BY_NODE_ID,
      {
        id: promptNodeId,
        versionLimit,
      },
    );

    if (!data.node) {
      throw new Error(`Prompt not found with node ID: ${promptNodeId}`);
    }

    return transformGraphQLPrompt(data.node);
  }

  if (promptName && spaceNodeId) {
    const result = await findPromptByName({
      promptName,
      spaceNodeId,
      apiKey,
      baseUrl,
    });

    if (!result) {
      throw new Error(
        `Prompt "${promptName}" not found in space ${spaceNodeId}`,
      );
    }

    return result;
  }

  throw new Error(
    "Either promptNodeId or both promptName and spaceNodeId must be provided",
  );
}

export type FindPromptByNameParams = {
  /** Prompt name to look up */
  promptName: string;
  /** GraphQL node ID of the space (base64-encoded Relay Global ID) */
  spaceNodeId: string;
  /** Override API key */
  apiKey?: string;
  /** Override GraphQL base URL (default: https://app.arize.com) */
  baseUrl?: string;
};

/**
 * Look up a prompt by name within a space. Returns `null` if no prompt
 * with the given name exists — unlike {@link getPromptContent}, this
 * function never throws for a missing prompt.
 *
 * @param promptName - Prompt name to look up.
 * @param spaceNodeId - GraphQL node ID of the space.
 * @param apiKey - Override API key.
 * @param baseUrl - Override GraphQL base URL.
 * @returns A {@link PromptWithContent} or `null` if not found.
 * @throws Error if the GraphQL request itself fails (auth, network, etc.).
 */
export async function findPromptByName({
  promptName,
  spaceNodeId,
  apiKey,
  baseUrl,
}: FindPromptByNameParams): Promise<PromptWithContent | null> {
  const clientOptions: GraphQLClientOptions = { apiKey, baseUrl };

  const data = await graphqlFetch<PromptByNameResponse>(
    clientOptions,
    GET_PROMPT_BY_NAME,
    {
      spaceId: spaceNodeId,
      name: promptName,
    },
  );

  const edges = data.node?.prompts?.edges;
  if (!edges || edges.length === 0) {
    return null;
  }

  return transformGraphQLPrompt(edges[0]!.node);
}
