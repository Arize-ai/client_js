import { createClient } from "../client";
import {
  CreateEvaluatorInput,
  EvaluatorWithVersion,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { templateConfigToRaw, transformEvaluatorWithVersion } from "./utils";
import { findSpaceId } from "../utils/resolve";

export type CreateEvaluatorParams = WithClient<CreateEvaluatorInput>;

/**
 * Create a new evaluator with an initial version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the evaluator (must be unique within the space).
 * @param space - The space name or ID to create the evaluator in.
 * @param type - The evaluator type. Must be "template".
 * @param version - The initial version configuration.
 * @param version.commitMessage - A message describing this version.
 * @param version.templateConfig - The LLM template configuration.
 * @param description - An optional description for the evaluator.
 * @returns The created {@link EvaluatorWithVersion}.
 * @throws Error if the evaluator cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createEvaluator } from "@arizeai/ax-client"
 *
 * const evaluator = await createEvaluator({
 *   name: "Relevance",
 *   space: "my-space",
 *   type: "template",
 *   version: {
 *     commitMessage: "Initial version",
 *     templateConfig: {
 *       name: "Relevance",
 *       template: "Is the following response relevant to the query?\nQuery: {{query}}\nResponse: {{response}}",
 *       includeExplanations: true,
 *       useFunctionCallingIfAvailable: true,
 *       classificationChoices: { relevant: 1, irrelevant: 0 },
 *       direction: "maximize",
 *       llmConfig: {
 *         aiIntegrationId: "your_ai_integration_id",
 *         modelName: "gpt-4o",
 *         invocationParameters: { temperature: 0 },
 *         providerParameters: {},
 *       },
 *     },
 *   },
 * });
 * console.log(evaluator);
 * ```
 */
export async function createEvaluator({
  client: clientInstance,
  name,
  description,
  space,
  type,
  version,
}: CreateEvaluatorParams): Promise<EvaluatorWithVersion> {
  warnPreRelease({ functionName: "createEvaluator" });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.POST("/v2/evaluators", {
    body: {
      name,
      description,
      space_id: spaceId,
      type,
      version: {
        commit_message: version.commitMessage,
        template_config: templateConfigToRaw(version.templateConfig),
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorWithVersion(response.data);
}
