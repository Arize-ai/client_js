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
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - An optional space ID to filter prompts in a specific space.
 * @param limit - An optional limit on the number of prompts to return (1-100, default 50).
 * @param cursor - An optional pagination cursor from a previous response.
 * @returns A paginated list of {@link Prompt} metadata objects.
 * @throws Error if the prompts cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listPrompts } from "@arizeai/ax-client"
 *
 * const prompts = await listPrompts();
 * console.log(prompts);
 * ```
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
