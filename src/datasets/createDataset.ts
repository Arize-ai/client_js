import { createClient } from "../client";
import { WithClient } from "../types/client";
import { Dataset, DatasetExampleInput } from "../types/datasets";
import { warnPreRelease } from "../utils/warning";
import { transformDataset } from "./utils";

export type CreateDatasetParams = WithClient<{
  spaceId: string;
  examples: DatasetExampleInput[];
  name: string;
}>;
/**
 * Create a new dataset with example(s).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - The space ID to create the dataset in.
 * @param examples - The array of examples ({@link DatasetExample}) to create the dataset with. The examples must follow the following rules:
 * - Each item in `examples[]` may contain **any user-defined fields**.
 * - **Do not** include system-managed fields on input: `id`, `created_at`, `updated_at`.
 *   Requests that contain these fields in any example **will be rejected**.
 * - Each example **must contain at least one property** (i.e., `{}` is invalid).
 * @returns A {@link Dataset}.
 * @throws Error if the dataset cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createDataset } from "@arizeai/ax-client"
 *
 * const dataset = await createDataset({
 *   spaceId: "your_space_id",
 *   examples: [
 *     { "question": "What is 2+2?", "answer": "4", "topic": "math" },
 *   ],
 *   name: "your_dataset_name",
 * });
 * console.log(dataset);
 * ```
 */
export async function createDataset({
  client: clientInstance,
  spaceId,
  examples,
  name,
}: CreateDatasetParams): Promise<Dataset> {
  warnPreRelease({ functionName: "createDataset" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/datasets", {
    body: {
      name,
      space_id: spaceId,
      examples,
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformDataset(response.data);
}
