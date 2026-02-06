import { createClient } from "../client";
import { WithClient } from "../types";
import { Experiment, ExperimentRunInput } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";
import { transformExperiment } from "./utils";

export type CreateExperimentParams = WithClient<{
  experimentName: string;
  datasetId: string;
  experimentRuns: ExperimentRunInput[];
}>;

/**
 * Create an experiment.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experimentName - The name of the experiment to create.
 * @param datasetId - The base64 encoded dataset ID to create the experiment on.
 * @param experimentRuns - An array of experiment runs to include. At least one run must
 * be provided and each run must contain at least:
 *   - 'example_id': The id of an existing example in the dataset.
 *   - 'output': The model or task output for that example.
 * @returns The created {@link Experiment}.
 * @throws Error if the experiment cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createExperiment } from "@arizeai/ax-client"
 *
 * const experiment = await createExperiment({ experimentName: "your_experiment", datasetId: "your_dataset_id", experimentRuns: [] });
 * console.log(experiment);
 * ```
 */
export async function createExperiment({
  client: clientInstance,
  experimentName,
  datasetId,
  experimentRuns,
}: CreateExperimentParams): Promise<Experiment> {
  warnPreRelease({ functionName: "createExperiment" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/experiments", {
    body: {
      name: experimentName,
      dataset_id: datasetId,
      experiment_runs: experimentRuns,
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformExperiment(response.data);
}
