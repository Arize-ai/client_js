import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type DeleteEvaluatorParams = WithClient<{
  evaluatorId: string;
}>;
// TODO: Add a name-based variant that resolves evaluatorId via listEvaluators
// once the REST API supports filtering by name.

/**
 * Delete an evaluator and all its versions. This operation is irreversible.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluatorId - The unique identifier of the evaluator to delete.
 * @returns void
 * @throws Error if the evaluator cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteEvaluator } from "@arizeai/ax-client"
 *
 * await deleteEvaluator({ evaluatorId: "your_evaluator_id" });
 * ```
 */
export async function deleteEvaluator({
  client: clientInstance,
  evaluatorId,
}: DeleteEvaluatorParams): Promise<void> {
  warnPreRelease({ functionName: "deleteEvaluator" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/evaluators/{evaluator_id}", {
    params: {
      path: { evaluator_id: evaluatorId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
