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
import { transformEvaluator } from "./utils";

export type ListEvaluatorsParams = WithClient<
  PaginationParams & {
    spaceId?: string;
  }
>;

/**
 * List evaluators accessible to the client, sorted by update date (most recent first).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - An optional space ID to filter evaluators to a specific space. When omitted, evaluators from all permitted spaces are returned.
 * @param limit - An optional limit on the number of evaluators to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Evaluator} objects.
 * @throws Error if the evaluators cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listEvaluators } from "@arizeai/ax-client"
 *
 * const evaluators = await listEvaluators({ spaceId: "your_space_id" });
 * console.log(evaluators);
 * ```
 */
export async function listEvaluators(
  params: ListEvaluatorsParams = {},
): Promise<PaginatedResponse<Evaluator>> {
  warnPreRelease({ functionName: "listEvaluators" });
  const { client: clientInstance, spaceId, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/evaluators", {
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
    data: response.data.evaluators.map(transformEvaluator),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
