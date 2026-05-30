import { createClient } from "../client";
import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { Experiment } from "../types/experiments";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { findDatasetId, toSpaceRef } from "../utils/resolve";
import { handleApiError } from "../errors";
import { transformExperiment } from "./utils";

export type ListExperimentsParams = WithClient<
  PaginationParams & {
    /** Dataset ID or name to filter experiments. */
    dataset?: string;
    /** Space ID or name. Required when `dataset` is a name. */
    space?: string;
  }
>;

/**
 * List the information about all experiments available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param dataset - An optional dataset ID or name to filter experiments.
 * @param space - An optional space ID or name. Required when `dataset` is a name.
 * @param limit - An optional limit on the number of experiments to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Experiment} objects.
 * @throws Error if the experiments cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listExperiments } from "@arizeai/ax-client"
 *
 * const experiments = await listExperiments({ dataset: "my-dataset", space: "my-space" });
 * console.log(experiments);
 * ```
 */
export async function listExperiments(
  params: ListExperimentsParams = {},
): Promise<PaginatedResponse<Experiment>> {
  warnPreRelease({ functionName: "listExperiments", stage: "beta" });
  const { client: clientInstance, dataset, space, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;
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
    return handleApiError(response);
  }
  return {
    data: response.data.experiments.map(transformExperiment),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
