import { createClient } from "../client";
import { WithClient } from "../types";
import { ExperimentRun } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findDatasetId, findExperimentId, toSpaceRef } from "../utils/resolve";
import { transformExperimentRun } from "./utils";

export type ListExperimentRunsParams = WithClient<{
  experiment: string;
  dataset?: string;
  space?: string;
  limit?: number;
}>;

/**
 * List the experiment runs for a specific experiment. Does not currently support pagination.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experiment - The experiment name or base64 encoded experiment ID.
 *   When a name is provided, it is resolved to an ID automatically (requires `dataset`).
 * @param dataset - The dataset name or ID. Required when `experiment` is a name.
 * @param space - The space name or ID. Required when `dataset` is a name.
 * @param limit - An optional limit on the number of experiment runs to return.
 * @returns A list of experiment runs.
 * @throws Error if the experiment runs cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listExperimentRuns } from "@arizeai/ax-client"
 *
 * // Using names
 * const experimentRuns = await listExperimentRuns({ experiment: "my-experiment", dataset: "my-dataset", space: "my-space" });
 *
 * // Using an ID directly
 * const experimentRuns = await listExperimentRuns({ experiment: "your_experiment_id" });
 * console.log(experimentRuns);
 * ```
 */
export async function listExperimentRuns({
  client: clientInstance,
  experiment,
  dataset,
  space,
  limit,
}: ListExperimentRunsParams): Promise<ExperimentRun[]> {
  warnPreRelease({ functionName: "listExperimentRuns", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;
  const experimentId = await findExperimentId(client, experiment, datasetId);
  const response = await client.GET("/v2/experiments/{experiment_id}/runs", {
    params: {
      path: { experiment_id: experimentId },
      query: {
        limit,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return response.data.experiment_runs.map(transformExperimentRun);
}
