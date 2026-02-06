import { createClient } from "../client";
import { WithClient } from "../types";
import { Dataset, DatasetExampleUpdate } from "../types/datasets";
import { warnPreRelease } from "../utils/warning";
import { transformDataset } from "./utils";

export type UpdateExamplesParams = WithClient<{
  /**
   * The ID of the dataset to update examples in.
   */
  datasetId: string;
  /**
   * An optional version of the dataset to update examples in.
   * @default latest dataset version
   */
  datasetVersionId?: string;
  /**
   * The array of examples ({@link DatasetExampleUpdate}) to update in the dataset.
   */
  examples: DatasetExampleUpdate[];
  /**
   * An optional new version name for the dataset. If provided, a new version of the dataset will be created with the update.
   * If not the version will be updated in place.
   */
  newVersionName?: string;
}>;
/**
 * Update examples in a dataset with a patch to each example updating existing fields and adding new fields. Does not remove fields that are omitted.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param datasetId - The ID of the dataset to update examples in.
 * @param datasetVersionId - An optional version of the dataset to update examples in. @default latest dataset version
 * @param examples - The array of examples ({@link DatasetExampleUpdate}) to update in the dataset.
 * The examples must follow the following rules:
 * - Each item in `examples[]` must include the `id` field to identify the example to update.
 * - Each item in `examples[]` may contain **any user-defined fields**.
 * - **Do not** include system-managed fields on input other than `id` (i.e., `created_at`, `updated_at`).
 *
 * Note:
 * - Only examples with IDs that already exist will be updated.
 * - You can update examples with new and existing fields, but you cannot remove existing fields.
 * @param newVersionName An optional new version name for the dataset. If provided, a new version of the dataset will be created with the update.
 * If not the version will be updated in place.
 * @returns A {@link Dataset}.
 * @throws Error if the examples cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateExamples } from "@arizeai/ax-client"
 *
 * const dataset = await updateExamples({
 *   datasetId: "your_dataset_id",
 *   examples: [
 *     {
 *       id: "your_example_id",
 *       question: "What is 2+2?",
 *       answer: "4",
 *       topic: "math",
 *     },
 *   ],
 *   newVersionName: "your_new_version_name",
 * });
 * console.log(dataset);
 * ```
 */
export async function updateExamples({
  client: clientInstance,
  datasetId,
  datasetVersionId,
  examples,
  newVersionName,
}: UpdateExamplesParams): Promise<Dataset> {
  warnPreRelease({ functionName: "updateExamples" });
  const client = clientInstance ?? createClient();
  const response = await client.PATCH("/v2/datasets/{dataset_id}/examples", {
    params: {
      path: { dataset_id: datasetId },
      query: {
        dataset_version_id: datasetVersionId,
      },
    },
    body: {
      examples,
      new_version: newVersionName,
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformDataset(response.data);
}
