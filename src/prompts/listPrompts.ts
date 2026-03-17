import { createClient } from "../client";
import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { Prompt } from "../types/prompts";
import { transformPaginationMetadata } from "../utils/pagination";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { transformPrompt } from "./utils";

export type ListPromptsParams = WithClient<
  PaginationParams & {
    spaceId?: string;
  }
>;

/**
 * List prompts available to the client.
 *
 * The prompts are sorted by update date, with the most recently updated prompts first.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - An optional space ID to filter prompts by space.
 * @param limit - An optional limit on the number of prompts to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Prompt} objects.
 * @throws Error if the prompts cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listPrompts } from "@arizeai/ax-client"
 *
 * const { data: prompts, pagination } = await listPrompts({ spaceId: "your_space_id" });
 * console.log(prompts);
 * ```
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
    return handleApiError(response);
  }
  return {
    data: response.data.prompts.map(transformPrompt),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
