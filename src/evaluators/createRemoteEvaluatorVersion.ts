import { createClient } from "../client";
import {
  CreateRemoteEvaluatorVersionInput,
  EvaluatorVersion,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluatorVersion } from "./utils";
import { findEvaluatorId, toSpaceRef } from "../utils/resolve";

export type CreateRemoteEvaluatorVersionParams =
  WithClient<CreateRemoteEvaluatorVersionInput>;

/**
 * Create a new remote version of an existing evaluator.
 *
 * The new version becomes the latest version immediately. The `integrationId`
 * references an `EVALUATOR` integration that defines the remote endpoint,
 * headers, and input schema for this version.
 *
 * **Note:** The integration is shared across evaluator versions; updating it
 * will affect all versions that reference it.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluator - The evaluator name or ID.
 * @param space - An optional space name or ID (required when resolving by evaluator name).
 * @param integrationId - The global ID of the `EVALUATOR` integration.
 * @param commitMessage - A commit message describing the changes.
 * @returns The created {@link EvaluatorVersion}.
 * @throws Error if the version cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createRemoteEvaluatorVersion } from "@arizeai/ax-client"
 *
 * const version = await createRemoteEvaluatorVersion({
 *   evaluator: "My Remote Evaluator",
 *   space: "my-space",
 *   integrationId: "<EVALUATOR integration global ID>",
 *   commitMessage: "Switch to new endpoint",
 * });
 * console.log(version);
 * ```
 */
export async function createRemoteEvaluatorVersion(
  params: CreateRemoteEvaluatorVersionParams,
): Promise<EvaluatorVersion> {
  warnPreRelease({
    functionName: "createRemoteEvaluatorVersion",
    stage: "beta",
  });
  const {
    client: clientInstance,
    evaluator,
    space,
    integrationId,
    commitMessage,
  } = params;
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const evaluatorId = await findEvaluatorId(client, evaluator, spaceRef);
  const response = await client.POST("/v2/evaluators/{evaluator_id}/versions", {
    params: {
      path: { evaluator_id: evaluatorId },
    },
    body: {
      commit_message: commitMessage,
      remote_config: { integration_id: integrationId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorVersion(response.data);
}
