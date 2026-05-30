import { createClient } from "../client";
import { EvaluatorWithVersion, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluatorWithVersion } from "./utils";
import { findEvaluatorId, toSpaceRef } from "../utils/resolve";

export type GetEvaluatorParams = WithClient<{
  evaluator: string;
  space?: string;
  versionId?: string;
}>;

/**
 * Get an evaluator by name or ID, including a resolved version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluator - The evaluator name or ID.
 * @param space - An optional space name or ID (required when resolving by evaluator name).
 * @param versionId - An optional version ID to resolve a specific version. Defaults to the latest version.
 * @returns The {@link EvaluatorWithVersion} with the resolved version.
 * @throws Error if the evaluator cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getEvaluator } from "@arizeai/ax-client"
 *
 * const evaluator = await getEvaluator({ evaluator: "Relevance", space: "my-space" });
 * console.log(evaluator);
 * ```
 */
export async function getEvaluator({
  client: clientInstance,
  evaluator,
  space,
  versionId,
}: GetEvaluatorParams): Promise<EvaluatorWithVersion> {
  warnPreRelease({ functionName: "getEvaluator", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const evaluatorId = await findEvaluatorId(client, evaluator, spaceRef);
  const response = await client.GET("/v2/evaluators/{evaluator_id}", {
    params: {
      path: { evaluator_id: evaluatorId },
      query: { version_id: versionId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorWithVersion(response.data);
}
