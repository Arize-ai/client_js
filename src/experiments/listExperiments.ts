import { createClient } from "../client";
import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { Experiment } from "../types/experiments";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { transformExperiment } from "./utils";

export type ListExperimentsParams = WithClient<
  PaginationParams & {
    datasetId?: string;
  }
>;

/**
 * List the information about all experiments available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param datasetId - An optional base64 encoded dataset ID used to filter experiments on a specific dataset.
 * @param limit - An optional limit on the number of experiments to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Experiment} objects.
 * @throws Error if the experiments cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listExperiments } from "@arizeai/ax-client"
 *
 * const experiments = await listExperiments({});
 * console.log(experiments);
 * ```
 */
export async function listExperiments(
  params: ListExperimentsParams = {},
): Promise<PaginatedResponse<Experiment>> {
  warnPreRelease({ functionName: "listExperiments" });
  const { client: clientInstance, datasetId, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/experiments", {
    params: {
      query: {
        dataset_id: datasetId,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return {
    data: response.data.experiments.map(transformExperiment),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
