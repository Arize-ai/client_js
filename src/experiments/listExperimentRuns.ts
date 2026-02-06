import { createClient } from "../client";
import { WithClient } from "../types";
import { ExperimentRun } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";

export type ListExperimentRunsParams = WithClient<{
  experimentId: string;
  limit?: number;
}>;

/**
 * List the experiment runs for a specific experiment. Does not currently support pagination.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experimentId - The base64 encoded experiment ID of the experiment to list runs for.
 * @param limit - An optional limit on the number of experiment runs to return.
 * @returns A list of experiment runs.
 * @throws Error if the experiment runs cannnot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listExperimentRuns } from "@arizeai/ax-client"
 *
 * const experimentRuns = await listExperimentRuns({ experimentId: "your_experiment_id" });
 * console.log(experimentRuns);
 * ```
 */
export async function listExperimentRuns({
  client: clientInstance,
  experimentId,
  limit,
}: ListExperimentRunsParams): Promise<ExperimentRun[]> {
  warnPreRelease({ functionName: "listExperimentRuns" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/experiments/{experiment_id}/runs", {
    params: {
      path: { experiment_id: experimentId },
      query: {
        limit,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return response.data.experiment_runs;
}
