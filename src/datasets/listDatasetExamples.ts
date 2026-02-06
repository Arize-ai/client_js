import { WithClient } from "../types";
import { DatasetExample } from "../types/datasets";
import { createClient } from "../client";
import { transformListDatasetExamplesResponseExample } from "./utils";
import { warnPreRelease } from "../utils/warning";

export type ListDatasetExamplesParams = WithClient<{
  datasetId: string;
  datasetVersionId?: string;
  limit?: number;
}>;

/**
 * List the examples of a specific dataset.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param datasetId - The ID of the dataset to list examples for.
 * @param datasetVersionId - An optional version of the dataset to list examples for. Defaults to the latest version if not provided.
 * @param limit - The maximum number of examples to return. @default 50
 * @returns A list of {@link DatasetExample | Dataset Examples}.
 * @throws Error if the examples cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listDatasetExamples } from "@arizeai/ax-client"
 *
 * const examples = await listDatasetExamples({ datasetId: "your_dataset_id" });
 * console.log(dataset);
 * ```
 *
 * Note:
 * - pagination is not supported yet.
 * - When pagination is enabled in the future, the behavior will match other list endpoints (cursor-based, opaque tokens).
 */
export async function listDatasetExamples({
  client: clientInstance,
  datasetId,
  datasetVersionId,
  limit,
}: ListDatasetExamplesParams): Promise<DatasetExample[]> {
  warnPreRelease({ functionName: "listDatasetExamples" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/datasets/{dataset_id}/examples", {
    params: {
      path: { dataset_id: datasetId },
      query: {
        dataset_version_id: datasetVersionId,
        limit,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return response.data.examples.map(
    transformListDatasetExamplesResponseExample,
  );
}
