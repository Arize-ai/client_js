import { createClient } from "../client";
import { Dataset, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformDataset } from "./utils";
import { findDatasetId, toSpaceRef } from "../utils/resolve";

export type GetDatasetParams = WithClient<{
  /**
   * The name or ID of the dataset to get.
   */
  dataset: string;
  /**
   * An optional space name or ID. Required when `dataset` is a name.
   */
  space?: string;
}>;

/**
 * Get the information about a specific dataset available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param dataset - The name or ID of the dataset to get.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @returns A {@link Dataset}.
 * @throws Error if the dataset cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getDataset } from "@arizeai/ax-client"
 *
 * const dataset = await getDataset({ dataset: "my_dataset", space: "my_space" });
 * console.log(dataset);
 * ```
 */
export async function getDataset({
  client: clientInstance,
  dataset,
  space,
}: GetDatasetParams): Promise<Dataset> {
  warnPreRelease({ functionName: "getDataset" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.GET("/v2/datasets/{dataset_id}", {
    params: {
      path: {
        dataset_id: datasetId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformDataset(response.data);
}
