import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findDatasetId, toSpaceRef } from "../utils/resolve";

export type DeleteDatasetParams = WithClient<{
  /**
   * The name or ID of the dataset to delete.
   */
  dataset: string;
  /**
   * An optional space name or ID. Required when `dataset` is a name.
   */
  space?: string;
}>;

/**
 * Delete a dataset by its name or ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param dataset - The name or ID of the dataset to delete.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @returns void.
 * @throws Error if the dataset cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteDataset } from "@arizeai/ax-client"
 *
 * await deleteDataset({
 *   dataset: "my_dataset",
 *   space: "my_space",
 * });
 * ```
 */
export async function deleteDataset({
  client: clientInstance,
  dataset,
  space,
}: DeleteDatasetParams): Promise<void> {
  warnPreRelease({ functionName: "deleteDataset" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.DELETE("/v2/datasets/{dataset_id}", {
    params: {
      path: { dataset_id: datasetId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
