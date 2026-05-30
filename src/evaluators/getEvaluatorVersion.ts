import { createClient } from "../client";
import { EvaluatorVersion, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluatorVersion } from "./utils";

export type GetEvaluatorVersionParams = WithClient<{
  versionId: string;
}>;

/**
 * Get a specific evaluator version by its global ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param versionId - The global ID of the evaluator version (base64).
 * @returns The {@link EvaluatorVersion}.
 * @throws Error if the version cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getEvaluatorVersion } from "@arizeai/ax-client"
 *
 * const version = await getEvaluatorVersion({ versionId: "RXZhbHVhdG9yVmVyc2lvbjphYmMxMjM=" });
 * console.log(version);
 * ```
 */
export async function getEvaluatorVersion({
  client: clientInstance,
  versionId,
}: GetEvaluatorVersionParams): Promise<EvaluatorVersion> {
  warnPreRelease({ functionName: "getEvaluatorVersion", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/evaluator-versions/{version_id}", {
    params: {
      path: { version_id: versionId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorVersion(response.data);
}
