import { createClient } from "../client";
import { Dataset, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformDataset } from "./utils";

export type GetDatasetParams = WithClient<{
  /**
   * The ID of the dataset to get.
   */
  datasetId: string;
}>;

/**
 * Get the information about a specific dataset available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param datasetId - The ID of the dataset to get.
 * @returns A {@link Dataset}.
 * @throws Error if the dataset cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getDataset } from "@arizeai/ax-client"
 *
 * const dataset = await getDataset({ datasetId: "your_dataset_id" });
 * console.log(dataset);
 * ```
 */
export async function getDataset({
  client: clientInstance,
  datasetId,
}: GetDatasetParams): Promise<Dataset> {
  warnPreRelease({ functionName: "getDataset" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/datasets/{dataset_id}", {
    params: {
      path: {
        dataset_id: datasetId,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformDataset(response.data);
}
