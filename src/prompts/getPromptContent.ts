import { graphqlFetch, GraphQLClientOptions } from "../graphql";
import {
  GET_PROMPT_BY_NODE_ID,
  GET_PROMPT_BY_NAME,
} from "../graphql/queries/prompts";
import { PromptWithContent } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformGraphQLPrompt } from "./utils";
import { RawGraphQLPrompt } from "../types/internal";

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
 * @param params.promptNodeId - GraphQL node ID for direct lookup.
 * @param params.promptName - Prompt name for lookup by name (requires spaceNodeId).
 * @param params.spaceNodeId - Space node ID (required when using promptName).
 * @param params.versionLimit - Number of versions to include.
 * @param params.apiKey - Override API key.
 * @param params.baseUrl - Override GraphQL base URL.
 * @returns A {@link PromptWithContent} object with full prompt data.
 */
export async function getPromptContent(
  params: GetPromptContentParams,
): Promise<PromptWithContent> {
  warnPreRelease({ functionName: "getPromptContent" });

  const clientOptions: GraphQLClientOptions = {
    apiKey: params.apiKey,
    baseUrl: params.baseUrl,
  };

  if (params.promptNodeId) {
    const data = await graphqlFetch<{ node: RawGraphQLPrompt }>(
      clientOptions,
      GET_PROMPT_BY_NODE_ID,
      {
        id: params.promptNodeId,
        versionLimit: params.versionLimit,
      },
    );

    if (!data.node) {
      throw new Error(`Prompt not found with node ID: ${params.promptNodeId}`);
    }

    return transformGraphQLPrompt(data.node);
  }

  if (params.promptName && params.spaceNodeId) {
    const data = await graphqlFetch<{
      node: {
        prompts: {
          edges: Array<{ node: RawGraphQLPrompt }>;
        };
      };
    }>(clientOptions, GET_PROMPT_BY_NAME, {
      spaceId: params.spaceNodeId,
      name: params.promptName,
    });

    const edges = data.node?.prompts?.edges;
    if (!edges || edges.length === 0) {
      throw new Error(
        `Prompt "${params.promptName}" not found in space ${params.spaceNodeId}`,
      );
    }

    return transformGraphQLPrompt(edges[0]!.node);
  }

  throw new Error(
    "Either promptNodeId or both promptName and spaceNodeId must be provided",
  );
}
