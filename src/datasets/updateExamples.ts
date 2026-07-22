import { createClient } from "../client";
import { WithClient } from "../types";
import {
  UpdateDatasetExampleInput,
  DatasetVersionWithExampleIds,
} from "../types/datasets";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformDatasetVersionWithExampleIds } from "./utils";
import { findDatasetId, toSpaceRef } from "../utils/resolve";

export type UpdateExamplesParams = WithClient<{
  /**
   * The name or ID of the dataset to update examples in.
   */
  dataset: string;
  /**
   * An optional space name or ID. Required when `dataset` is a name.
   */
  space?: string;
  /**
   * An optional version of the dataset to update examples in.
   * @default latest dataset version
   */
  datasetVersionId?: string;
  /**
   * The array of examples ({@link UpdateDatasetExampleInput}) to update in the dataset.
   */
  examples: UpdateDatasetExampleInput[];
  /**
   * An optional new version name for the dataset. If provided, a new version of the dataset will be created with the update.
   * If not the version will be updated in place.
   */
  newVersion?: string;
}>;
/**
 * Update examples in a dataset with a patch to each example updating existing fields and adding new fields. Does not remove fields that are omitted.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param dataset - The name or ID of the dataset to update examples in.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @param datasetVersionId - An optional version of the dataset to update examples in. @default latest dataset version
 * @param examples - The array of examples ({@link UpdateDatasetExampleInput}) to update in the dataset.
 * The examples must follow the following rules:
 * - Each item in `examples[]` must include the `id` field to identify the example to update.
 * - Each item in `examples[]` may contain **any user-defined fields**.
 * - **Do not** include system-managed fields on input other than `id` (i.e., `created_at`, `updated_at`).
 *
 * Note:
 * - Only examples with IDs that already exist will be updated.
 * - You can update examples with new and existing fields, but you cannot remove existing fields.
 * @param newVersion An optional new version name for the dataset. If provided, a new version of the dataset will be created with the update.
 * If not the version will be updated in place.
 * @returns A {@link DatasetVersionWithExampleIds} containing the dataset attributes, the version the examples were written to, and the IDs of the updated examples.
 * @throws Error if the examples cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateExamples } from "@arizeai/ax-client"
 *
 * const dataset = await updateExamples({
 *   dataset: "my_dataset",
 *   space: "my_space",
 *   examples: [
 *     {
 *       id: "your_example_id",
 *       question: "What is 2+2?",
 *       answer: "4",
 *       topic: "math",
 *     },
 *   ],
 *   newVersion: "your_new_version_name",
 * });
 * console.log(dataset);
 * ```
 */
export async function updateExamples({
  client: clientInstance,
  dataset,
  space,
  datasetVersionId,
  examples,
  newVersion,
}: UpdateExamplesParams): Promise<DatasetVersionWithExampleIds> {
  warnPreRelease({ functionName: "updateExamples", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.PATCH("/v2/datasets/{dataset_id}/examples", {
    params: {
      path: { dataset_id: datasetId },
      query: {
        dataset_version_id: datasetVersionId,
      },
    },
    body: {
      examples,
      new_version: newVersion,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformDatasetVersionWithExampleIds(response.data);
}
