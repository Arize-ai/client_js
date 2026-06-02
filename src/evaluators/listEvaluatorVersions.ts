import { createClient } from "../client";
import {
  EvaluatorVersion,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluatorVersion } from "./utils";
import { findEvaluatorId, toSpaceRef } from "../utils/resolve";

export type ListEvaluatorVersionsParams = WithClient<
  PaginationParams & {
    evaluator: string;
    space?: string;
  }
>;

/**
 * List all versions of an evaluator with cursor-based pagination.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluator - The evaluator name or ID.
 * @param space - An optional space name or ID (required when resolving by evaluator name).
 * @param limit - An optional limit on the number of versions to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link EvaluatorVersion} objects.
 * @throws Error if the evaluator versions cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listEvaluatorVersions } from "@arizeai/ax-client"
 *
 * const versions = await listEvaluatorVersions({ evaluator: "Relevance", space: "my-space" });
 * console.log(versions);
 * ```
 */
export async function listEvaluatorVersions({
  client: clientInstance,
  evaluator,
  space,
  limit = DEFAULT_LIST_LIMIT,
  cursor,
}: ListEvaluatorVersionsParams): Promise<PaginatedResponse<EvaluatorVersion>> {
  warnPreRelease({ functionName: "listEvaluatorVersions", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const evaluatorId = await findEvaluatorId(client, evaluator, spaceRef);
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
