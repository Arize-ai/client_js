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
 *   When a name is provided, it is resolved to an ID automatically, which
 *   requires either `dataset` or `space`.
 * @param dataset - The dataset name or ID. Resolves `experiment` within that dataset.
 * @param space - The space name or ID. Resolves `experiment` within that space when
 *   `dataset` is omitted — the only option for an experiment with no dataset — and
 *   resolves `dataset` itself when it is a name.
 * @throws {AmbiguousNameError} If resolving by `space` alone and the name matches
 *   more than one experiment in that space. Pass `dataset` or an ID to disambiguate.
 * @throws Error if the experiment cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteExperiment } from "@arizeai/ax-client"
 *
 * // Using names
 * await deleteExperiment({ experiment: "my-experiment", dataset: "my-dataset", space: "my-space" });
 *
 * // By name within a space, for an experiment with no dataset
 * await deleteExperiment({ experiment: "my-experiment", space: "my-space" });
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
  warnPreRelease({ functionName: "deleteExperiment", stage: "beta" });
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
  const response = await client.DELETE("/v2/experiments/{experiment_id}", {
    params: {
      path: { experiment_id: experimentId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
