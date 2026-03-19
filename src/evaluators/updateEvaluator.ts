import { createClient } from "../client";
import { Evaluator, UpdateEvaluatorInput, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluator } from "./utils";

export type UpdateEvaluatorParams = WithClient<
  UpdateEvaluatorInput & {
    evaluatorId: string;
  }
>;

/**
 * Update an evaluator's metadata. At least one of `name` or `description` must be provided.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluatorId - The unique identifier of the evaluator to update.
 * @param name - An optional new name for the evaluator.
 * @param description - An optional new description for the evaluator.
 * @returns The updated {@link Evaluator}.
 * @throws Error if the evaluator cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateEvaluator } from "@arizeai/ax-client"
 *
 * const evaluator = await updateEvaluator({
 *   evaluatorId: "your_evaluator_id",
 *   name: "Updated Evaluator Name",
 * });
 * console.log(evaluator);
 * ```
 */
export async function updateEvaluator({
  client: clientInstance,
  evaluatorId,
  name,
  description,
}: UpdateEvaluatorParams): Promise<Evaluator> {
  warnPreRelease({ functionName: "updateEvaluator" });
  const client = clientInstance ?? createClient();
  const response = await client.PATCH("/v2/evaluators/{evaluator_id}", {
    params: {
      path: { evaluator_id: evaluatorId },
    },
    body: { name, description },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluator(response.data);
}
