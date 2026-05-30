import { createClient } from "../client";
import { WithClient } from "../types";
import {
  DatasetExampleInput,
  DatasetVersionWithExampleIds,
} from "../types/datasets";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformDatasetVersionWithExampleIds } from "./utils";
import { findDatasetId, toSpaceRef } from "../utils/resolve";

export type AppendExamplesParams = WithClient<{
  /**
   * The name or ID of the dataset to add examples to.
   */
  dataset: string;
  /**
   * An optional space name or ID. Required when `dataset` is a name.
   */
  space?: string;
  datasetVersionId?: string;
  examples: DatasetExampleInput[];
}>;

/**
 * Add new examples to a dataset.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param dataset - The name or ID of the dataset to add examples to.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @param datasetVersionId - An optional version of the dataset to add examples to. @default latest dataset version
 * @param examples - The array of examples ({@link DatasetExampleInput}) to add to the dataset. The examples must follow the following rules:
 * - Each item in `examples[]` may contain **any user-defined fields**.
 * - **Do not** include system-managed fields on input: `id`, `created_at`, `updated_at`.
 *   Requests that contain these fields in any example **will be rejected**.
 * - Each example **must contain at least one property** (i.e., `{}` is invalid).
 * @returns A {@link DatasetVersionWithExampleIds} containing the dataset attributes, the version the examples were written to, and the IDs of the inserted examples.
 * @throws Error if the examples cannot be added or the response is invalid.
 * @example
 * ```typescript
 * import { appendExamples } from "@arizeai/ax-client"
 *
 * const result = await appendExamples({ dataset: "my_dataset", space: "my_space", examples: [{ "question": "What is 2+2?", "answer": "4", "topic": "math" }] });
 * console.log(result.exampleIds); // IDs of the inserted examples
 * ```
 */
export async function appendExamples({
  client: clientInstance,
  dataset,
  space,
  datasetVersionId,
  examples,
}: AppendExamplesParams): Promise<DatasetVersionWithExampleIds> {
  warnPreRelease({ functionName: "appendExamples", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.POST("/v2/datasets/{dataset_id}/examples", {
    params: {
      path: { dataset_id: datasetId },
      query: {
        dataset_version_id: datasetVersionId,
      },
    },
    body: {
      examples,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformDatasetVersionWithExampleIds(response.data);
}
