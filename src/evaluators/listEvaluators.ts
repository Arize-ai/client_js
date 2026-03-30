import { createClient } from "../client";
import {
  Evaluator,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { resolveSpace } from "../utils/space";
import { transformEvaluator } from "./utils";

export type ListEvaluatorsParams = WithClient<
  PaginationParams & {
    /**
     * Optional space filter. If the value starts with `"spc_"` it is treated
     * as a space ID; otherwise it is used as a case-insensitive substring
     * filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the evaluator name. */
    name?: string;
  }
>;

/**
 * List evaluators accessible to the client, sorted by update date (most recent first).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - An optional space filter. Pass a space ID (e.g. `"spc_abc123"`) or a space name for substring filtering.
 * @param name - An optional case-insensitive substring filter on the evaluator name.
 * @param limit - An optional limit on the number of evaluators to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Evaluator} objects.
 * @throws Error if the evaluators cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listEvaluators } from "@arizeai/ax-client"
 *
 * const evaluators = await listEvaluators({ space: "my-space" });
 * console.log(evaluators);
 * ```
 */
export async function listEvaluators(
  params: ListEvaluatorsParams = {},
): Promise<PaginatedResponse<Evaluator>> {
  warnPreRelease({ functionName: "listEvaluators" });
  const { client: clientInstance, space, name, limit, cursor } = params;
  const { spaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/evaluators", {
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
    data: response.data.evaluators.map(transformEvaluator),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
