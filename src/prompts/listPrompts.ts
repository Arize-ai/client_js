import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  Prompt,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { transformPrompt } from "./utils";

export type ListPromptsParams = WithClient<
  PaginationParams & {
    spaceId?: string;
  }
>;

/**
 * List prompts the user has access to, sorted by most recently updated.
 *
 * @param client - An optional ArizeClient instance.
 * @param spaceId - Filter to a specific space.
 * @param limit - Max results (1-100, default 50).
 * @param cursor - Pagination cursor from a previous response.
 * @returns A paginated list of {@link Prompt} metadata objects.
 *
 * @remarks The Arize v2 Prompts API is in alpha. Prompts returned contain
 * metadata only (no messages or template content).
 */
export async function listPrompts(
  params: ListPromptsParams = {},
): Promise<PaginatedResponse<Prompt>> {
  warnPreRelease({ functionName: "listPrompts" });
  const { client: clientInstance, spaceId, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/prompts", {
    params: {
      query: {
        space_id: spaceId,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return {
    data: response.data.prompts.map(transformPrompt),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
