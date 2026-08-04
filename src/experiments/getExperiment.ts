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
 *   When a name is provided, it is resolved to an ID automatically, which
 *   requires either `dataset` or `space`.
 * @param dataset - The dataset name or ID. Resolves `experiment` within that dataset.
 * @param space - The space name or ID. Resolves `experiment` within that space when
 *   `dataset` is omitted — the only option for an experiment with no dataset — and
 *   resolves `dataset` itself when it is a name.
 * @returns The experiment info.
 * @throws {AmbiguousNameError} If resolving by `space` alone and the name matches
 *   more than one experiment in that space. Names are unique per dataset and, for
 *   experiments without one, per space — so a space can hold several experiments
 *   with the same name. Pass `dataset` or an ID to disambiguate.
 * @throws Error if the experiment cannot be retrieved or the response is invalid.
 * @example
 * ```typescript
 * import { getExperiment } from "@arizeai/ax-client"
 *
 * // Using names
 * const experiment = await getExperiment({ experiment: "my-experiment", dataset: "my-dataset", space: "my-space" })
 *
 * // By name within a space, for an experiment with no dataset
 * const standalone = await getExperiment({ experiment: "my-experiment", space: "my-space" })
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
  const experimentId = await findExperimentId(
    client,
    experiment,
    datasetId,
    spaceRef,
  );
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
