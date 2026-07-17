import { createClient } from "../client";
import { WithClient } from "../types/client";
import { Dataset, CreateDatasetExampleInput } from "../types/datasets";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformDataset } from "./utils";
import { findSpaceId } from "../utils/resolve";

export type CreateDatasetParams = WithClient<{
  space: string;
  examples: CreateDatasetExampleInput[];
  name: string;
}>;

/**
 * Create a new dataset with example(s).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - The space name or ID to create the dataset in.
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
 *   space: "your_space_name",
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
  space,
  examples,
  name,
}: CreateDatasetParams): Promise<Dataset> {
  warnPreRelease({ functionName: "createDataset", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.POST("/v2/datasets", {
    body: {
      name,
      space_id: spaceId,
      examples,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformDataset(response.data);
}
