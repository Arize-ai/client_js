import { createClient } from "../client";
import {
  CreateCodeEvaluatorInput,
  EvaluatorWithVersion,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { codeConfigToRaw, transformEvaluatorWithVersion } from "./utils";
import { findSpaceId } from "../utils/resolve";

export type CreateCodeEvaluatorParams = WithClient<CreateCodeEvaluatorInput>;

/**
 * Create a new code evaluator with an initial version.
 *
 * Use {@link ManagedCodeConfig} for built-in evaluators (regex, JSON parse,
 * keyword checks, exact match) or {@link CustomCodeConfig} for user-supplied
 * Python.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the evaluator (must be unique within the space).
 * @param space - The space name or ID to create the evaluator in.
 * @param description - An optional description for the evaluator.
 * @param commitMessage - A message describing this initial version.
 * @param codeConfig - The code evaluator configuration.
 * @returns The created {@link EvaluatorWithVersion}.
 * @throws Error if the evaluator cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createCodeEvaluator } from "@arizeai/ax-client"
 *
 * const evaluator = await createCodeEvaluator({
 *   name: "JSON Parseable",
 *   space: "my-space",
 *   commitMessage: "Initial version",
 *   codeConfig: {
 *     type: "managed",
 *     name: "json_parseable",
 *     managedEvaluator: "JSONParseable",
 *     variables: ["output"],
 *   },
 * });
 * console.log(evaluator);
 * ```
 */
export async function createCodeEvaluator(
  params: CreateCodeEvaluatorParams,
): Promise<EvaluatorWithVersion> {
  warnPreRelease({ functionName: "createCodeEvaluator" });
  const {
    client: clientInstance,
    name,
    description,
    space,
    commitMessage,
    codeConfig,
  } = params;
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.POST("/v2/evaluators", {
    body: {
      name,
      description,
      space_id: spaceId,
      type: "code",
      version: {
        commit_message: commitMessage,
        code_config: codeConfigToRaw(codeConfig),
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorWithVersion(response.data);
}
