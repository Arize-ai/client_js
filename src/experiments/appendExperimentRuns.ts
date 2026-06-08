import { createClient } from "../client";
import { WithClient } from "../types";
import { Experiment, ExperimentRunInput } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findExperimentId, findDatasetId, toSpaceRef } from "../utils/resolve";
import { normalizeExperimentRun, transformExperiment } from "./utils";

export type AppendExperimentRunsParams = WithClient<{
  /**
   * The name or ID of the experiment to append runs to.
   */
  experiment: string;
  /**
   * An optional dataset name or ID used to resolve `experiment` by name.
   */
  dataset?: string;
  /**
   * An optional space name or ID used to resolve `dataset` by name.
   */
  space?: string;
  /**
   * Runs to append. Between 1 and 1000 runs per request.
   */
  experimentRuns: ExperimentRunInput[];
}>;

export type ExperimentWithRunIds = Experiment & {
  /**
   * IDs of the newly inserted experiment runs, in input order.
   */
  runIds: string[];
};

/**
 * Append runs to an existing experiment.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param experiment - The name or base64-encoded ID of the experiment.
 * @param dataset - An optional dataset name or ID used to resolve `experiment` by name.
 * @param space - An optional space name or ID used to resolve `dataset` by name.
 * @param experimentRuns - Runs to append (1–1000). Each run must contain at least:
 *   - `exampleId`: The ID of an existing example in the dataset.
 *   - `output`: The model or task output for that example.
 * @returns An {@link ExperimentWithRunIds} containing the updated experiment attributes
 *   and the IDs of the inserted runs, in input order.
 * @throws Error if the runs cannot be appended or the response is invalid.
 * @example
 * ```typescript
 * import { appendExperimentRuns } from "@arizeai/ax-client"
 *
 * const result = await appendExperimentRuns({
 *   space: "my_space",
 *   dataset: "my_dataset",
 *   experiment: "my_experiment",
 *   experimentRuns: [
 *     { exampleId: "ex_abc123", output: "The answer is 42" },
 *   ],
 * });
 * console.log(result.runIds); // IDs of the inserted runs
 * ```
 */
export async function appendExperimentRuns({
  client: clientInstance,
  experiment,
  dataset,
  space,
  experimentRuns,
}: AppendExperimentRunsParams): Promise<ExperimentWithRunIds> {
  warnPreRelease({ functionName: "appendExperimentRuns", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;
  const experimentId = await findExperimentId(client, experiment, datasetId);
  const response = await client.POST("/v2/experiments/{experiment_id}/runs", {
    params: {
      path: { experiment_id: experimentId },
    },
    body: {
      experiment_runs: experimentRuns.map(normalizeExperimentRun),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  const data = response.data;
  return {
    ...transformExperiment(data),
    runIds: data.run_ids,
  };
}
