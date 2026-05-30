import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findEvaluatorId, toSpaceRef } from "../utils/resolve";

export type DeleteEvaluatorParams = WithClient<{
  evaluator: string;
  space?: string;
}>;

/**
 * Delete an evaluator and all its versions. This operation is irreversible.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluator - The evaluator name or ID.
 * @param space - An optional space name or ID (required when resolving by evaluator name).
 * @returns void
 * @throws Error if the evaluator cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteEvaluator } from "@arizeai/ax-client"
 *
 * await deleteEvaluator({ evaluator: "Relevance", space: "my-space" });
 * ```
 */
export async function deleteEvaluator({
  client: clientInstance,
  evaluator,
  space,
}: DeleteEvaluatorParams): Promise<void> {
  warnPreRelease({ functionName: "deleteEvaluator", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const evaluatorId = await findEvaluatorId(client, evaluator, spaceRef);
  const response = await client.DELETE("/v2/evaluators/{evaluator_id}", {
    params: {
      path: { evaluator_id: evaluatorId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
