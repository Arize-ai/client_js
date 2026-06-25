import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { DatasetExample } from "../types/datasets";
import { createClient } from "../client";
import { transformListDatasetExamplesResponseExample } from "./utils";
import { warnPreRelease } from "../utils/warning";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { handleApiError } from "../errors";
import { findDatasetId, toSpaceRef } from "../utils/resolve";

export type ListDatasetExamplesParams = WithClient<
  PaginationParams & {
    /**
     * The name or ID of the dataset to list examples for.
     */
    dataset: string;
    /**
     * An optional space name or ID. Required when `dataset` is a name.
     */
    space?: string;
    /**
     * An optional version of the dataset to list examples for. Defaults to
     * the latest version if not provided.
     */
    datasetVersionId?: string;
  }
>;

/**
 * List the examples of a specific dataset.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param dataset - The name or ID of the dataset to list examples for.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @param datasetVersionId - An optional version of the dataset to list examples for. Defaults to the latest version if not provided.
 * @param limit - The maximum number of examples to return. @default 50
 * @param cursor - An optional opaque pagination cursor from a previous response's `pagination.nextCursor`. When omitted, results start from the first page.
 * @returns A {@link PaginatedResponse} containing {@link DatasetExample | Dataset Examples} and pagination metadata.
 * @throws Error if the examples cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listDatasetExamples } from "@arizeai/ax-client"
 *
 * const { data: examples, pagination } = await listDatasetExamples({ dataset: "my_dataset", space: "my_space" });
 * console.log(examples);
 * if (pagination.hasMore) {
 *   const nextPage = await listDatasetExamples({ dataset: "my_dataset", space: "my_space", cursor: pagination.nextCursor });
 * }
 * ```
 */
export async function listDatasetExamples({
  client: clientInstance,
  dataset,
  space,
  datasetVersionId,
  limit = DEFAULT_LIST_LIMIT,
  cursor,
}: ListDatasetExamplesParams): Promise<PaginatedResponse<DatasetExample>> {
  warnPreRelease({ functionName: "listDatasetExamples", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.GET("/v2/datasets/{dataset_id}/examples", {
    params: {
      path: { dataset_id: datasetId },
      query: {
        dataset_version_id: datasetVersionId,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.examples.map(
      transformListDatasetExamplesResponseExample,
    ),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
