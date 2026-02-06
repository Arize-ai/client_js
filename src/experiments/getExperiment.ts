import { createClient } from "../client";
import { WithClient } from "../types";
import { Experiment } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";
import { transformExperiment } from "./utils";

export type GetExperimentParams = WithClient<{
  experimentId: string;
}>;

/**
 * Get the information about an experiment by its id - excludes the experiment's runs.
 * To list the runs of a specific experiment, use `listExperimentRuns`.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experimentId - The base64 encoded experiment ID of the experiment to retrieve.
 * @returns The experiment info.
 * @throws Error if the experiment cannot be retrieved or the response is invalid.
 * @example
 * ```typescript
 * import { getExperiment } from "@arizeai/ax-client"
 *
 * const experiment = await getExperiment({ experimentId: "your_experiment_id" })
 * console.log(experiment);
 * ```
 */
export async function getExperiment({
  client: clientInstance,
  experimentId,
}: GetExperimentParams): Promise<Experiment> {
  warnPreRelease({ functionName: "getExperiment" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/experiments/{experiment_id}", {
    params: {
      path: { experiment_id: experimentId },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformExperiment(response.data);
}
