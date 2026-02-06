import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";

export type DeleteDatasetParams = WithClient<{
  datasetId: string;
}>;

/**
 * Delete a dataset by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param datasetId - The ID of the dataset to delete.
 * @returns void.
 * @throws Error if the dataset cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteDataset } from "@arizeai/ax-client"
 *
 * await deleteDataset({
 *   datasetId: "your_dataset_id",
 * });
 * ```
 */
export async function deleteDataset({
  client: clientInstance,
  datasetId,
}: DeleteDatasetParams): Promise<void> {
  warnPreRelease({ functionName: "deleteDataset" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/datasets/{dataset_id}", {
    params: {
      path: { dataset_id: datasetId },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
}
