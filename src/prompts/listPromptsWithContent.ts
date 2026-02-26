import { graphqlFetch, GraphQLClientOptions } from "../graphql";
import { LIST_PROMPTS_WITH_CONTENT } from "../graphql/queries/prompts";
import { PaginatedResponse, PromptWithContent } from "../types";
import { warnPreRelease } from "../utils/warning";
import {
  transformGraphQLPrompt,
  RawGraphQLPrompt,
} from "./transformGraphQL";

export type ListPromptsWithContentParams = {
  /** GraphQL node ID of the space */
  spaceNodeId: string;
  /** Number of prompts to return (default: 50) */
  first?: number;
  /** Pagination cursor from a previous response */
  after?: string;
  /** Override API key */
  apiKey?: string;
  /** Override GraphQL base URL (default: https://app.arize.com) */
  baseUrl?: string;
};

/**
 * List prompts with full content via the GraphQL API.
 *
 * @param params.spaceNodeId - GraphQL node ID of the space.
 * @param params.first - Number of prompts to return (default: 50).
 * @param params.after - Pagination cursor.
 * @param params.apiKey - Override API key.
 * @param params.baseUrl - Override GraphQL base URL.
 * @returns A paginated list of {@link PromptWithContent} objects.
 */
export async function listPromptsWithContent(
  params: ListPromptsWithContentParams,
): Promise<PaginatedResponse<PromptWithContent>> {
  warnPreRelease({ functionName: "listPromptsWithContent" });

  const clientOptions: GraphQLClientOptions = {
    apiKey: params.apiKey,
    baseUrl: params.baseUrl,
  };

  const data = await graphqlFetch<{
    node: {
      prompts: {
        totalCount: number;
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
        edges: Array<{ node: RawGraphQLPrompt }>;
      };
    };
  }>(clientOptions, LIST_PROMPTS_WITH_CONTENT, {
    spaceId: params.spaceNodeId,
    first: params.first ?? 50,
    after: params.after,
  });

  const prompts = data.node?.prompts;
  if (!prompts) {
    throw new Error(`Space not found with node ID: ${params.spaceNodeId}`);
  }

  return {
    data: prompts.edges.map((edge) => transformGraphQLPrompt(edge.node)),
    pagination: {
      hasMore: prompts.pageInfo.hasNextPage,
      nextCursor: prompts.pageInfo.endCursor ?? undefined,
    },
  };
}
