import { createClient } from "../client";
import { Evaluator, UpdateEvaluatorInput, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluator } from "./utils";
import { findEvaluatorId, toSpaceRef } from "../utils/resolve";

export type UpdateEvaluatorParams = WithClient<
  UpdateEvaluatorInput & {
    evaluator: string;
    space?: string;
  }
>;

/**
 * Update an evaluator's metadata. At least one of `name` or `description` must be provided.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluator - The evaluator name or ID.
 * @param space - An optional space name or ID (required when resolving by evaluator name).
 * @param name - An optional new name for the evaluator.
 * @param description - An optional new description for the evaluator.
 * @returns The updated {@link Evaluator}.
 * @throws Error if the evaluator cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateEvaluator } from "@arizeai/ax-client"
 *
 * const evaluator = await updateEvaluator({
 *   evaluator: "Relevance",
 *   space: "my-space",
 *   name: "Updated Evaluator Name",
 * });
 * console.log(evaluator);
 * ```
 */
export async function updateEvaluator({
  client: clientInstance,
  evaluator,
  space,
  name,
  description,
}: UpdateEvaluatorParams): Promise<Evaluator> {
  warnPreRelease({ functionName: "updateEvaluator", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const evaluatorId = await findEvaluatorId(client, evaluator, spaceRef);
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
