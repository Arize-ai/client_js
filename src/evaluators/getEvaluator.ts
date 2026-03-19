import { createClient } from "../client";
import { EvaluatorWithVersion, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluatorWithVersion } from "./utils";

export type GetEvaluatorParams = WithClient<{
  evaluatorId: string;
  versionId?: string;
}>;

/**
 * Get an evaluator by ID, including a resolved version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluatorId - The unique identifier of the evaluator.
 * @param versionId - An optional version ID to resolve a specific version. Defaults to the latest version.
 * @returns The {@link EvaluatorWithVersion} with the resolved version.
 * @throws Error if the evaluator cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getEvaluator } from "@arizeai/ax-client"
 *
 * const evaluator = await getEvaluator({ evaluatorId: "your_evaluator_id" });
 * console.log(evaluator);
 * ```
 */
export async function getEvaluator({
  client: clientInstance,
  evaluatorId,
  versionId,
}: GetEvaluatorParams): Promise<EvaluatorWithVersion> {
  warnPreRelease({ functionName: "getEvaluator" });
  const client = clientInstance ?? createClient();
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
