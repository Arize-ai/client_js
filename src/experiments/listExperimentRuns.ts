import { createClient } from "../client";
import { PaginatedResponse, WithClient } from "../types";
import { ExperimentRun } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { handleApiError } from "../errors";
import { findDatasetId, findExperimentId, toSpaceRef } from "../utils/resolve";
import { transformExperimentRun } from "./utils";

export type ListExperimentRunsParams = WithClient<{
  experiment: string;
  dataset?: string;
  space?: string;
  limit?: number;
  /** Opaque pagination cursor from a previous response's `pagination.next_cursor`. */
  cursor?: string;
}>;

/**
 * List the experiment runs for a specific experiment.
 *
 * Runs are returned in a stable insertion order that survives segment compaction.
 *
 * Pass `pagination.next_cursor` from the response back as `cursor` to retrieve
 * the next page. The cursor is opaque — do not parse or construct it.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experiment - The experiment name or base64 encoded experiment ID.
 *   When a name is provided, it is resolved to an ID automatically (requires `dataset`).
 * @param dataset - The dataset name or ID. Required when `experiment` is a name.
 * @param space - The space name or ID. Required when `dataset` is a name.
 * @param limit - An optional limit on the number of experiment runs to return (max 500).
 * @param cursor - An optional opaque pagination cursor from a previous response.
 * @returns A {@link PaginatedResponse} of {@link ExperimentRun} objects.
 * @throws Error if the experiment runs cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listExperimentRuns } from "@arizeai/ax-client"
 *
 * // Using names
 * const result = await listExperimentRuns({ experiment: "my-experiment", dataset: "my-dataset", space: "my-space" });
 * console.log(result.data);
 *
 * // Paginating through all runs
 * let cursor: string | undefined;
 * do {
 *   const result = await listExperimentRuns({ experiment: "your_experiment_id", cursor });
 *   console.log(result.data);
 *   cursor = result.pagination.nextCursor ?? undefined;
 * } while (cursor);
 * ```
 */
export async function listExperimentRuns({
  client: clientInstance,
  experiment,
  dataset,
  space,
  limit = DEFAULT_LIST_LIMIT,
  cursor,
}: ListExperimentRunsParams): Promise<PaginatedResponse<ExperimentRun>> {
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
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.experiment_runs.map(transformExperimentRun),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
