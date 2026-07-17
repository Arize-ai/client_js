import { createClient } from "../client";
import type { components } from "../__generated__/api/v2";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findDatasetId, toSpaceRef } from "../utils/resolve";

export type DeleteDatasetExamplesParams = WithClient<{
  /**
   * The name or ID of the dataset to delete examples from.
   */
  dataset: string;
  /**
   * An optional space name or ID. Required when `dataset` is a name.
   */
  space?: string;
  /**
   * The version of the dataset to delete examples from. Examples are removed
   * in place from this version; no new version is created.
   */
  datasetVersionId: string;
  /**
   * The IDs of the examples to delete. Must contain between 1 and 1000 IDs,
   * with no duplicate or empty values.
   */
  examples: string[];
}>;

export type DeleteDatasetExamplesResult = {
  /**
   * `true` when the operation finished and no retry is needed. `false` when the
   * operation could not fully complete — retry the original full request (this
   * delete request is idempotent).
   */
  completed: boolean;
  /** Example IDs confirmed deleted in this request. */
  deletedExampleIds: string[];
  /**
   * Requested example IDs that were not deleted: either not found in the
   * selected version (never added, or already deleted), or whose deletion did
   * not complete when `completed` is `false`.
   */
  notDeletedExampleIds: string[];
};

function transformDeleteResponse(
  raw: components["schemas"]["DeleteDatasetExamplesResponse"],
): DeleteDatasetExamplesResult {
  return {
    completed: raw.completed,
    deletedExampleIds: raw.deleted_example_ids,
    notDeletedExampleIds: raw.not_deleted_example_ids,
  };
}

/**
 * Delete a batch of examples from a dataset version by their IDs.
 *
 * Examples are removed in place from the given version; no new version is
 * created. This delete request is partial-tolerant and idempotent — examples that exist
 * in the selected version are deleted, requested IDs that were not deleted are
 * reported back, and re-submitting already-deleted IDs is safe.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param dataset - The name or ID of the dataset to delete examples from.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @param datasetVersionId - The version of the dataset to delete examples from. Examples are removed in place; no new version is created.
 * @param examples - The IDs of the examples to delete. Must contain between 1 and 1000 IDs, with no duplicate or empty values.
 * @returns A {@link DeleteDatasetExamplesResult} with `completed`,
 *   `deletedExampleIds`, and `notDeletedExampleIds`. When `completed` is
 *   `false`, retry the original full request — this delete request is idempotent.
 * @throws Error if the examples cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteDatasetExamples } from "@arizeai/ax-client"
 *
 * const result = await deleteDatasetExamples({
 *   dataset: "my_dataset",
 *   space: "my_space",
 *   datasetVersionId: "your_dataset_version_id",
 *   examples: ["example_id_1", "example_id_2"],
 * });
 * if (!result.completed) {
 *   // retry the original full request
 * }
 * ```
 */
export async function deleteDatasetExamples({
  client: clientInstance,
  dataset,
  space,
  datasetVersionId,
  examples,
}: DeleteDatasetExamplesParams): Promise<DeleteDatasetExamplesResult> {
  warnPreRelease({ functionName: "deleteDatasetExamples", stage: "beta" });
  if (examples.length === 0) {
    throw new Error("examples must not be empty");
  }
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.DELETE("/v2/datasets/{dataset_id}/examples", {
    params: {
      path: { dataset_id: datasetId },
    },
    body: {
      dataset_version_id: datasetVersionId,
      example_ids: examples,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformDeleteResponse(response.data);
}
