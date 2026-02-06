import { createClient } from "../client";
import { WithClient } from "../types";
import { Dataset, DatasetExampleInput } from "../types/datasets";
import { warnPreRelease } from "../utils/warning";
import { transformDataset } from "./utils";

export type AppendExamplesParams = WithClient<{
  datasetId: string;
  datasetVersionId?: string;
  examples: DatasetExampleInput[];
}>;

/**
 * Add new examples to a dataset.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param datasetId - The ID of the dataset to add examples to.
 * @param datasetVersionId - An optional version of the dataset to add examples to. @default latest dataset version
 * @param examples - The array of examples ({@link DatasetExampleInput}) to add to the dataset. The examples must follow the following rules:
 * - Each item in `examples[]` may contain **any user-defined fields**.
 * - **Do not** include system-managed fields on input: `id`, `created_at`, `updated_at`.
 *   Requests that contain these fields in any example **will be rejected**.
 * - Each example **must contain at least one property** (i.e., `{}` is invalid).
 * @returns A {@link Dataset}.
 * @throws Error if the examples cannot be added or the response is invalid.
 * @example
 * ```typescript
 * import { appendExamples } from "@arizeai/ax-client"
 *
 * const dataset = await appendExamples({ datasetId: "your_dataset_id", examples: [{ "question": "What is 2+2?", "answer": "4", "topic": "math" }] });
 * console.log(dataset);
 * ```
 */
export async function appendExamples({
  client: clientInstance,
  datasetId,
  datasetVersionId,
  examples,
}: AppendExamplesParams): Promise<Dataset> {
  warnPreRelease({ functionName: "appendExamples" });
  const client = clientInstance ?? createClient();
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
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformDataset(response.data);
}
