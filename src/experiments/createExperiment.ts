import { createClient } from "../client";
import { WithClient } from "../types";
import { Experiment, ExperimentRunInput } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findDatasetId, toSpaceRef } from "../utils/resolve";
import { normalizeExperimentRun, transformExperiment } from "./utils";

export type CreateExperimentParams = WithClient<{
  experimentName: string;
  dataset: string;
  experimentRuns: ExperimentRunInput[];
  space?: string;
}>;

/**
 * Create an experiment.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experimentName - The name of the experiment to create.
 * @param dataset - The dataset name or base64 encoded dataset ID to create the experiment on.
 *   When a name is provided, it is resolved to an ID automatically (requires `space`).
 * @param experimentRuns - An array of experiment runs to include. At least one run must
 * be provided and each run must contain at least:
 *   - 'exampleId': The id of an existing example in the dataset.
 *   - 'output': The model or task output for that example.
 * @param space - The space name or ID. Required when `dataset` is a name.
 * @returns The created {@link Experiment}.
 * @throws Error if the experiment cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createExperiment } from "@arizeai/ax-client"
 *
 * // Using names
 * const experiment = await createExperiment({ experimentName: "your_experiment", dataset: "my-dataset", space: "my-space", experimentRuns: [] });
 *
 * // Using IDs directly
 * const experiment = await createExperiment({ experimentName: "your_experiment", dataset: "your_dataset_id", experimentRuns: [] });
 * console.log(experiment);
 * ```
 */
export async function createExperiment({
  client: clientInstance,
  experimentName,
  dataset,
  experimentRuns,
  space,
}: CreateExperimentParams): Promise<Experiment> {
  warnPreRelease({ functionName: "createExperiment" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.POST("/v2/experiments", {
    body: {
      name: experimentName,
      dataset_id: datasetId,
      experiment_runs: experimentRuns.map(normalizeExperimentRun),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformExperiment(response.data);
}
