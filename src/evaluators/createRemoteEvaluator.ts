import { createClient } from "../client";
import {
  CreateRemoteEvaluatorInput,
  EvaluatorWithVersion,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformEvaluatorWithVersion } from "./utils";
import { findSpaceId } from "../utils/resolve";

export type CreateRemoteEvaluatorParams =
  WithClient<CreateRemoteEvaluatorInput>;

/**
 * Create a new remote evaluator with an initial version.
 *
 * Remote evaluators call a customer-hosted HTTP endpoint on each evaluation
 * run. The endpoint must already exist as an `EVALUATOR` integration created
 * via `createIntegration` (or `POST /v2/integrations`). The feature flag
 * `enableRemoteEvalTasks` must be enabled on the account.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the evaluator (must be unique within the space).
 * @param space - The space name or ID to create the evaluator in.
 * @param integrationId - The global ID of the `EVALUATOR` integration that
 *   defines the remote endpoint, headers, and input schema.
 * @param commitMessage - A commit message for the initial version.
 * @param description - An optional description for the evaluator.
 * @returns The created {@link EvaluatorWithVersion}.
 * @throws Error if the evaluator cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createRemoteEvaluator } from "@arizeai/ax-client"
 *
 * const evaluator = await createRemoteEvaluator({
 *   name: "My Remote Evaluator",
 *   space: "my-space",
 *   integrationId: "<EVALUATOR integration global ID>",
 *   commitMessage: "Initial version",
 * });
 * console.log(evaluator);
 * ```
 */
export async function createRemoteEvaluator(
  params: CreateRemoteEvaluatorParams,
): Promise<EvaluatorWithVersion> {
  warnPreRelease({ functionName: "createRemoteEvaluator", stage: "beta" });
  const {
    client: clientInstance,
    name,
    description,
    space,
    integrationId,
    commitMessage,
  } = params;
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.POST("/v2/evaluators", {
    body: {
      name,
      description,
      space_id: spaceId,
      type: "REMOTE",
      version: {
        commit_message: commitMessage,
        remote_config: { integration_id: integrationId },
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorWithVersion(response.data);
}
