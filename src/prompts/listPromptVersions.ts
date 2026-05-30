import { createClient } from "../client";
import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { PromptVersion } from "../types/prompts";
import { transformPaginationMetadata } from "../utils/pagination";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { findPromptId, toSpaceRef } from "../utils/resolve";
import { transformPromptVersion } from "./utils";

export type ListPromptVersionsParams = WithClient<
  PaginationParams & {
    prompt: string;
    space?: string;
  }
>;

/**
 * List all versions of a prompt, sorted by creation date with the most recently created first.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param prompt - The name or ID of the prompt whose versions to list.
 * @param space - An optional space name or ID (required when resolving a prompt by name).
 * @param limit - An optional limit on the number of versions to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link PromptVersion} objects.
 * @throws Error if the versions cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listPromptVersions } from "@arizeai/ax-client"
 *
 * const { data: versions, pagination } = await listPromptVersions({
 *   prompt: "customer-support",
 *   space: "my-space",
 * });
 * console.log(versions);
 * ```
 */
export async function listPromptVersions({
  client: clientInstance,
  prompt,
  space,
  limit,
  cursor,
}: ListPromptVersionsParams): Promise<PaginatedResponse<PromptVersion>> {
  warnPreRelease({ functionName: "listPromptVersions", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const promptId = await findPromptId(client, prompt, spaceRef);
  const response = await client.GET("/v2/prompts/{prompt_id}/versions", {
    params: {
      path: { prompt_id: promptId },
      query: { limit, cursor },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.prompt_versions.map(transformPromptVersion),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
