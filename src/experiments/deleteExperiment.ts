import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findDatasetId, findExperimentId, toSpaceRef } from "../utils/resolve";

export type DeleteExperimentParams = WithClient<{
  experiment: string;
  dataset?: string;
  space?: string;
}>;

/**
 * Delete an experiment by its name or ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experiment - The experiment name or base64 encoded experiment ID.
 *   When a name is provided, it is resolved to an ID automatically (requires `dataset`).
 * @param dataset - The dataset name or ID. Required when `experiment` is a name.
 * @param space - The space name or ID. Required when `dataset` is a name.
 * @throws Error if the experiment cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteExperiment } from "@arizeai/ax-client"
 *
 * // Using names
 * await deleteExperiment({ experiment: "my-experiment", dataset: "my-dataset", space: "my-space" });
 *
 * // Using an ID directly
 * await deleteExperiment({ experiment: "your_experiment_id" });
 * ```
 */
export async function deleteExperiment({
  client: clientInstance,
  experiment,
  dataset,
  space,
}: DeleteExperimentParams): Promise<void> {
  warnPreRelease({ functionName: "deleteExperiment" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;
  const experimentId = await findExperimentId(client, experiment, datasetId);
  const response = await client.DELETE("/v2/experiments/{experiment_id}", {
    params: {
      path: { experiment_id: experimentId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
