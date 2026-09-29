import { createClient } from "../client";
import type { components } from "../__generated__/api/v2";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findEvaluatorId, toSpaceRef } from "../utils/resolve";

export type DeleteEvaluatorVersionsParams = WithClient<{
  /**
   * The name or ID of the evaluator to delete versions from.
   */
  evaluator: string;
  /**
   * An optional space name or ID. Required when `evaluator` is a name.
   */
  space?: string;
  /**
   * The IDs of the evaluator versions to delete. Must contain between 1 and 100
   * IDs. Duplicate IDs are accepted and silently collapsed server-side.
   */
  versionIds: string[];
}>;

export type DeleteEvaluatorVersionsResult = {
  /**
   * Always `true` on a successful response, indicating both result lists are
   * complete. This does not indicate whether all requested versions existed.
   */
  completed: boolean;
  /** Evaluator version IDs confirmed deleted in this request. */
  deletedVersionIds: string[];
  /**
   * Requested evaluator version IDs that were not deleted: either not found or
   * belonging to a different evaluator.
   */
  notDeletedVersionIds: string[];
};

function transformDeleteResponse(
  raw: components["schemas"]["DeleteEvaluatorVersionsResponse"],
): DeleteEvaluatorVersionsResult {
  return {
    completed: raw.completed,
    deletedVersionIds: raw.deleted_version_ids,
    notDeletedVersionIds: raw.not_deleted_version_ids,
  };
}

/**
 * Delete a batch of evaluator versions by their IDs.
 *
 * This delete is irreversible and partial-tolerant — versions that exist and
 * belong to the evaluator are deleted, requested IDs that were not deleted are
 * reported back, and re-submitting already-deleted IDs is safe. Deleting a
 * version pinned to a running online task un-pins that task, which then falls
 * back to resolving the evaluator's latest version.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param evaluator - The name or ID of the evaluator to delete versions from.
 * @param space - An optional space name or ID. Required when `evaluator` is a name.
 * @param versionIds - The IDs of the evaluator versions to delete. Must contain between 1 and 100 IDs.
 * @returns A {@link DeleteEvaluatorVersionsResult} with `completed`,
 *   `deletedVersionIds`, and `notDeletedVersionIds`.
 * @throws Error if the versions cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteEvaluatorVersions } from "@arizeai/ax-client"
 *
 * const result = await deleteEvaluatorVersions({
 *   evaluator: "Relevance",
 *   space: "my_space",
 *   versionIds: ["version_id_1", "version_id_2"],
 * });
 * console.log(result.deletedVersionIds);
 * ```
 */
export async function deleteEvaluatorVersions({
  client: clientInstance,
  evaluator,
  space,
  versionIds,
}: DeleteEvaluatorVersionsParams): Promise<DeleteEvaluatorVersionsResult> {
  warnPreRelease({ functionName: "deleteEvaluatorVersions", stage: "beta" });
  if (versionIds.length === 0) {
    throw new Error("versionIds must not be empty");
  }
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const evaluatorId = await findEvaluatorId(client, evaluator, spaceRef);
  const response = await client.DELETE(
    "/v2/evaluators/{evaluator_id}/versions",
    {
      params: {
        path: { evaluator_id: evaluatorId },
      },
      body: {
        version_ids: versionIds,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformDeleteResponse(response.data);
}
