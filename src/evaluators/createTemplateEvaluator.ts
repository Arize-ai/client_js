import { createClient } from "../client";
import {
  CreateTemplateEvaluatorInput,
  EvaluatorWithVersion,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { templateConfigToRaw, transformEvaluatorWithVersion } from "./utils";
import { findSpaceId } from "../utils/resolve";

export type CreateTemplateEvaluatorParams =
  WithClient<CreateTemplateEvaluatorInput>;

/**
 * Create a new template (LLM-as-judge) evaluator with an initial version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the evaluator (must be unique within the space).
 * @param space - The space name or ID to create the evaluator in.
 * @param description - An optional description for the evaluator.
 * @param commitMessage - A message describing this initial version.
 * @param templateConfig - The LLM template configuration.
 * @returns The created {@link EvaluatorWithVersion}.
 * @throws Error if the evaluator cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createTemplateEvaluator } from "@arizeai/ax-client"
 *
 * const evaluator = await createTemplateEvaluator({
 *   name: "Relevance",
 *   space: "my-space",
 *   commitMessage: "Initial version",
 *   templateConfig: {
 *     name: "Relevance",
 *     template: "Is the following response relevant to the query?\nQuery: {{query}}\nResponse: {{response}}",
 *     includeExplanations: true,
 *     useFunctionCallingIfAvailable: true,
 *     classificationChoices: { relevant: 1, irrelevant: 0 },
 *     direction: "maximize",
 *     llmConfig: {
 *       aiIntegrationId: "QUlJbnRlZ3JhdGlvbjphYmMxMjM=",
 *       modelName: "gpt-4o",
 *       invocationParameters: { temperature: 0 },
 *       providerParameters: {},
 *     },
 *   },
 * });
 * console.log(evaluator);
 * ```
 */
export async function createTemplateEvaluator(
  params: CreateTemplateEvaluatorParams,
): Promise<EvaluatorWithVersion> {
  warnPreRelease({ functionName: "createTemplateEvaluator", stage: "beta" });
  const {
    client: clientInstance,
    name,
    description,
    space,
    commitMessage,
    templateConfig,
  } = params;
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.POST("/v2/evaluators", {
    body: {
      name,
      description,
      space_id: spaceId,
      type: "template",
      version: {
        commit_message: commitMessage,
        template_config: templateConfigToRaw(templateConfig),
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorWithVersion(response.data);
}
