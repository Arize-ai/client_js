import { createClient } from "../client";
import {
  CreateCodeEvaluatorVersionInput,
  EvaluatorVersion,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { codeConfigToRaw, transformEvaluatorVersion } from "./utils";
import { findEvaluatorId, toSpaceRef } from "../utils/resolve";

export type CreateCodeEvaluatorVersionParams =
  WithClient<CreateCodeEvaluatorVersionInput>;

/**
 * Create a new code version of an existing evaluator.
 *
 * The new version becomes the latest version immediately. Versions are
 * immutable once created; to change the configuration, create a new version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluator - The evaluator name or ID.
 * @param space - An optional space name or ID (required when resolving by evaluator name).
 * @param commitMessage - A message describing the changes in this version.
 * @param codeConfig - The updated code evaluator configuration.
 * @returns The created {@link EvaluatorVersion}.
 * @throws Error if the version cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createCodeEvaluatorVersion } from "@arizeai/ax-client"
 *
 * const version = await createCodeEvaluatorVersion({
 *   evaluator: "JSON Parseable",
 *   space: "my-space",
 *   commitMessage: "Updated code",
 *   codeConfig: {
 *     type: "MANAGED",
 *     name: "json_parseable",
 *     managedEvaluator: "JSON_PARSEABLE",
 *     variables: ["output"],
 *   },
 * });
 * console.log(version);
 * ```
 */
export async function createCodeEvaluatorVersion(
  params: CreateCodeEvaluatorVersionParams,
): Promise<EvaluatorVersion> {
  warnPreRelease({
    functionName: "createCodeEvaluatorVersion",
    stage: "beta",
  });
  const {
    client: clientInstance,
    evaluator,
    space,
    commitMessage,
    codeConfig,
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
      code_config: codeConfigToRaw(codeConfig),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorVersion(response.data);
}
