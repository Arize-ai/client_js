import { createClient } from "../client";
import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { Prompt } from "../types/prompts";
import { transformPaginationMetadata } from "../utils/pagination";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { resolveSpace } from "../utils/space";
import { transformPrompt } from "./utils";

export type ListPromptsParams = WithClient<
  PaginationParams & {
    /**
     * Optional space filter. If the value starts with `"spc_"` it is treated
     * as a space ID; otherwise it is used as a case-insensitive substring
     * filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the prompt name. */
    name?: string;
  }
>;

/**
 * List prompts available to the client.
 *
 * The prompts are sorted by update date, with the most recently updated prompts first.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - An optional space filter. Pass a space ID (e.g. `"spc_abc123"`) or a space name for substring filtering.
 * @param name - An optional case-insensitive substring filter on the prompt name.
 * @param limit - An optional limit on the number of prompts to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Prompt} objects.
 * @throws Error if the prompts cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listPrompts } from "@arizeai/ax-client"
 *
 * const { data: prompts, pagination } = await listPrompts({ space: "my-space" });
 * console.log(prompts);
 * ```
 */
export async function listPrompts(
  params: ListPromptsParams = {},
): Promise<PaginatedResponse<Prompt>> {
  warnPreRelease({ functionName: "listPrompts" });
  const { client: clientInstance, space, name, limit, cursor } = params;
  const { spaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/prompts", {
    params: {
      query: {
        space_id: spaceId,
        space_name: spaceName,
        name,
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
