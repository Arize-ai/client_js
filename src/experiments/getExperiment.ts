import { createClient } from "../client";
import { WithClient } from "../types";
import { Experiment } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findDatasetId, findExperimentId, toSpaceRef } from "../utils/resolve";
import { transformExperiment } from "./utils";

export type GetExperimentParams = WithClient<{
  experiment: string;
  dataset?: string;
  space?: string;
}>;

/**
 * Get the information about an experiment by its name or ID - excludes the experiment's runs.
 * To list the runs of a specific experiment, use `listExperimentRuns`.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experiment - The experiment name or base64 encoded experiment ID.
 *   When a name is provided, it is resolved to an ID automatically (requires `dataset`).
 * @param dataset - The dataset name or ID. Required when `experiment` is a name.
 * @param space - The space name or ID. Required when `dataset` is a name.
 * @returns The experiment info.
 * @throws Error if the experiment cannot be retrieved or the response is invalid.
 * @example
 * ```typescript
 * import { getExperiment } from "@arizeai/ax-client"
 *
 * // Using names
 * const experiment = await getExperiment({ experiment: "my-experiment", dataset: "my-dataset", space: "my-space" })
 *
 * // Using an ID directly
 * const experiment = await getExperiment({ experiment: "your_experiment_id" })
 * console.log(experiment);
 * ```
 */
export async function getExperiment({
  client: clientInstance,
  experiment,
  dataset,
  space,
}: GetExperimentParams): Promise<Experiment> {
  warnPreRelease({ functionName: "getExperiment", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;
  const experimentId = await findExperimentId(client, experiment, datasetId);
  const response = await client.GET("/v2/experiments/{experiment_id}", {
    params: {
      path: { experiment_id: experimentId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformExperiment(response.data);
}
