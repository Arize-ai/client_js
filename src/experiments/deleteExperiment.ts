import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";

export type DeleteExperimentParams = WithClient<{
  experimentId: string;
}>;

/**
 * Delete an experiment by its id.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experimentId - The base64 encoded experiment ID of the experiment to delete.
 * @throws Error if the experiment cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteExperiment } from "@arizeai/ax-client"
 *
 * await deleteExperiment({ experimentId: "your_experiment_id" });
 * ```
 */
export async function deleteExperiment({
  client: clientInstance,
  experimentId,
}: DeleteExperimentParams): Promise<void> {
  warnPreRelease({ functionName: "deleteExperiment" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/experiments/{experiment_id}", {
    params: {
      path: { experiment_id: experimentId },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
}
