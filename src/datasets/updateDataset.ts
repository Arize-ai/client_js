import { createClient } from "../client";
import { WithClient } from "../types/client";
import { Dataset } from "../types/datasets";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformDataset } from "./utils";
import { findDatasetId, toSpaceRef } from "../utils/resolve";

export type UpdateDatasetParams = WithClient<{
  /**
   * The name or ID of the dataset to update.
   */
  dataset: string;
  /**
   * An optional space name or ID. Required when `dataset` is a name.
   */
  space?: string;
  /**
   * The new name for the dataset. Must be unique within the space.
   */
  name: string;
}>;

/**
 * Update a dataset by its name or ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param dataset - The name or ID of the dataset to update.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @param name - The new name for the dataset. Must be unique within the space.
 * @returns The updated {@link Dataset}.
 * @throws Error if the dataset cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateDataset } from "@arizeai/ax-client"
 *
 * const dataset = await updateDataset({
 *   dataset: "my_dataset",
 *   space: "my_space",
 *   name: "my_renamed_dataset",
 * });
 * console.log(dataset);
 * ```
 */
export async function updateDataset({
  client: clientInstance,
  dataset,
  space,
  name,
}: UpdateDatasetParams): Promise<Dataset> {
  warnPreRelease({ functionName: "updateDataset" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.PATCH("/v2/datasets/{dataset_id}", {
    params: {
      path: { dataset_id: datasetId },
    },
    body: { name },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformDataset(response.data);
}
