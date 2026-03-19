import { createClient } from "../client";
import {
  EvaluatorVersion,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluatorVersion } from "./utils";

export type ListEvaluatorVersionsParams = WithClient<
  PaginationParams & {
    evaluatorId: string;
  }
>;
// TODO: Support filtering by evaluator name once the REST API adds a name
// filter to the list-versions endpoint.

/**
 * List all versions of an evaluator with cursor-based pagination.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluatorId - The unique identifier of the evaluator.
 * @param limit - An optional limit on the number of versions to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link EvaluatorVersion} objects.
 * @throws Error if the evaluator versions cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listEvaluatorVersions } from "@arizeai/ax-client"
 *
 * const versions = await listEvaluatorVersions({ evaluatorId: "your_evaluator_id" });
 * console.log(versions);
 * ```
 */
export async function listEvaluatorVersions({
  client: clientInstance,
  evaluatorId,
  limit,
  cursor,
}: ListEvaluatorVersionsParams): Promise<PaginatedResponse<EvaluatorVersion>> {
  warnPreRelease({ functionName: "listEvaluatorVersions" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/evaluators/{evaluator_id}/versions", {
    params: {
      path: { evaluator_id: evaluatorId },
      query: { limit, cursor },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.evaluator_versions.map(transformEvaluatorVersion),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
