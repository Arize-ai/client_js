import { createClient } from "../client";
import {
  Dataset,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { transformDataset } from "./utils";

export type ListDatasetsParams = WithClient<
  PaginationParams & {
    spaceId?: string;
  }
>;

/**
 * List the information about all datasets available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - An optional base64 encoded space ID used to filter datasets in a specific space.
 * @param limit - An optional limit on the number of datasets to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Dataset} objects.
 * @throws Error if the datasets cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listDatasets } from "@arizeai/ax-client"
 *
 * const datasets = await listDatasets();
 * console.log(datasets);
 * ```
 */
export async function listDatasets(
  params: ListDatasetsParams = {},
): Promise<PaginatedResponse<Dataset>> {
  warnPreRelease({ functionName: "listDatasets" });
  const { client: clientInstance, spaceId, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/datasets", {
    params: {
      query: {
        space_id: spaceId,
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
    data: response.data.datasets.map(transformDataset),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
