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
    /**
     * An optional SQL-like filter expression (e.g., `topic = 'arithmetic'`).
     * When omitted, empty, or whitespace-only, no filter is applied and all
     * examples are returned.
     */
    filter?: string;
  }
>;

/**
 * List the examples of a specific dataset, optionally filtered by a
 * server-side filter expression.
 *
 * This always calls `POST examples/search` because the filter DSL can't be
 * carried in query params.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param dataset - The name or ID of the dataset to list examples for.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @param datasetVersionId - An optional version of the dataset to list examples for. Defaults to the latest version if not provided.
 * @param filter - An optional filter expression using SQL-like syntax (e.g., `topic = 'arithmetic'`). An empty or whitespace-only value is omitted.
 * @param limit - The maximum number of examples to return. @default 50
 * @param cursor - An optional opaque pagination cursor from a previous response's `pagination.nextCursor`. When omitted, results start from the first page. Keep `filter` unchanged while paging with `cursor`.
 * @returns A {@link PaginatedResponse} containing {@link DatasetExample | Dataset Examples} and pagination metadata.
 * @throws Error if the dataset examples cannot be listed (e.g., the dataset or version does not exist), the filter is invalid (400), or the response is invalid.
 * @example
 * ```typescript
 * import { listDatasetExamples } from "@arizeai/ax-client"
 *
 * const { data: examples, pagination } = await listDatasetExamples({ dataset: "my_dataset", space: "my_space" });
 * console.log(examples);
 * if (pagination.hasMore) {
 *   const nextPage = await listDatasetExamples({ dataset: "my_dataset", space: "my_space", cursor: pagination.nextCursor });
 * }
 *
 * const { data: filtered } = await listDatasetExamples({
 *   dataset: "my_dataset",
 *   space: "my_space",
 *   filter: "topic = 'arithmetic'",
 * });
 * ```
 */
export async function listDatasetExamples({
  client: clientInstance,
  dataset,
  space,
  datasetVersionId,
  filter,
  limit = DEFAULT_LIST_LIMIT,
  cursor,
}: ListDatasetExamplesParams): Promise<PaginatedResponse<DatasetExample>> {
  warnPreRelease({ functionName: "listDatasetExamples", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.POST(
    "/v2/datasets/{dataset_id}/examples/search",
    {
      params: { path: { dataset_id: datasetId } },
      body: {
        filter: filter?.trim() ? filter : undefined,
        limit,
        cursor,
        dataset_version_id: datasetVersionId,
      },
    },
  );
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
