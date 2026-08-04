import { createClient } from "../client";
import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { Experiment } from "../types/experiments";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { findDatasetId, findSpaceId, toSpaceRef } from "../utils/resolve";
import { handleApiError } from "../errors";
import { transformExperiment } from "./utils";

export type ListExperimentsParams = WithClient<
  PaginationParams & {
    /** Dataset ID or name to filter experiments. */
    dataset?: string;
    /**
     * Space ID or name. Filters to experiments in that space when `dataset`
     * is omitted, and is required to resolve `dataset` when it is a name.
     */
    space?: string;
  }
>;

/**
 * List the information about all experiments available to the client.
 *
 * Narrows the results by whichever scope is given:
 * - `dataset` — only experiments run on that dataset.
 * - `space` — every experiment in that space, both those associated with a
 *   dataset and those without one.
 * - neither — every experiment across all spaces the caller can read.
 *
 * Passing both applies the narrower `dataset` scope, with `space` used only to
 * resolve a dataset name.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param dataset - An optional dataset ID or name to filter experiments.
 * @param space - An optional space ID or name. Filters to that space when
 *   `dataset` is omitted; required to resolve `dataset` when it is a name.
 * @param limit - An optional limit on the number of experiments to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Experiment} objects.
 * @throws Error if the experiments cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listExperiments } from "@arizeai/ax-client"
 *
 * // Every experiment on one dataset
 * const experiments = await listExperiments({ dataset: "my-dataset", space: "my-space" });
 *
 * // Every experiment in a space, with or without a dataset
 * const all = await listExperiments({ space: "my-space" });
 * console.log(experiments);
 * ```
 */
export async function listExperiments(
  params: ListExperimentsParams = {},
): Promise<PaginatedResponse<Experiment>> {
  warnPreRelease({ functionName: "listExperiments", stage: "beta" });
  const {
    client: clientInstance,
    dataset,
    space,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  // Callers may pass both `dataset` and `space`, but the endpoint 400s when it
  // receives `dataset_id` and `space_id` together — so resolve to exactly one.
  // `dataset` is the narrower scope and wins; `space` then only resolves its name.
  let datasetId: string | undefined;
  let spaceId: string | undefined;
  if (dataset !== undefined) {
    datasetId = await findDatasetId(client, dataset, toSpaceRef(space));
  } else if (space !== undefined) {
    spaceId = await findSpaceId(client, space);
  }
  const response = await client.GET("/v2/experiments", {
    params: {
      query: {
        dataset_id: datasetId,
        space_id: spaceId,
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
