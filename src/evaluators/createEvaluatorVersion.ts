import { createClient } from "../client";
import {
  CreateEvaluatorVersionInput,
  EvaluatorVersion,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { templateConfigToRaw, transformEvaluatorVersion } from "./utils";

export type CreateEvaluatorVersionParams =
  WithClient<CreateEvaluatorVersionInput>;

/**
 * Create a new version of an existing evaluator. The new version becomes the latest version immediately.
 * Versions are immutable once created. To change the configuration, create a new version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluatorId - The unique identifier of the evaluator to version.
 * @param commitMessage - A message describing the changes in this version.
 * @param templateConfig - The LLM template configuration for this version.
 * @returns The created {@link EvaluatorVersion}.
 * @throws Error if the version cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createEvaluatorVersion } from "@arizeai/ax-client"
 *
 * const version = await createEvaluatorVersion({
 *   evaluatorId: "your_evaluator_id",
 *   commitMessage: "Updated prompt template",
 *   templateConfig: {
 *     name: "Relevance",
 *     template: "Rate the relevance of the response.\nQuery: {{query}}\nResponse: {{response}}",
 *     includeExplanations: true,
 *     useFunctionCallingIfAvailable: true,
 *     classificationChoices: { relevant: 1, irrelevant: 0 },
 *     direction: "maximize",
 *     llmConfig: {
 *       aiIntegrationId: "your_ai_integration_id",
 *       modelName: "gpt-4o",
 *       invocationParameters: { temperature: 0 },
 *       providerParameters: {},
 *     },
 *   },
 * });
 * console.log(version);
 * ```
 */
export async function createEvaluatorVersion({
  client: clientInstance,
  evaluatorId,
  commitMessage,
  templateConfig,
}: CreateEvaluatorVersionParams): Promise<EvaluatorVersion> {
  warnPreRelease({ functionName: "createEvaluatorVersion" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/evaluators/{evaluator_id}/versions", {
    params: {
      path: { evaluator_id: evaluatorId },
    },
    body: {
      commit_message: commitMessage,
      template_config: templateConfigToRaw(templateConfig),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorVersion(response.data);
}
