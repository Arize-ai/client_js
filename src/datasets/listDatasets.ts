import { createClient } from "../client";
import {
  Dataset,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { resolveSpace } from "../utils/space";
import { transformDataset } from "./utils";

export type ListDatasetsParams = WithClient<
  PaginationParams & {
    /**
     * Optional space filter. If the value starts with `"spc_"` it is treated
     * as a space ID; otherwise it is used as a case-insensitive substring
     * filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the dataset name. */
    name?: string;
  }
>;

/**
 * List the information about all datasets available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - An optional space filter. Pass a space ID (e.g. `"spc_abc123"`) or a space name for substring filtering.
 * @param name - An optional case-insensitive substring filter on the dataset name.
 * @param limit - An optional limit on the number of datasets to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Dataset} objects.
 * @throws Error if the datasets cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listDatasets } from "@arizeai/ax-client"
 *
 * const datasets = await listDatasets({ space: "my-space" });
 * console.log(datasets);
 * ```
 */
export async function listDatasets(
  params: ListDatasetsParams = {},
): Promise<PaginatedResponse<Dataset>> {
  warnPreRelease({ functionName: "listDatasets" });
  const { client: clientInstance, space, name, limit, cursor } = params;
  const { spaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/datasets", {
    params: {
      query: {
        space_id: spaceId,
        space_name: spaceName,
        name,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.datasets.map(transformDataset),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
