import { createClient } from "../client";
import {
  CreateTemplateEvaluatorVersionInput,
  EvaluatorVersion,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { templateConfigToRaw, transformEvaluatorVersion } from "./utils";
import { findEvaluatorId, toSpaceRef } from "../utils/resolve";

export type CreateTemplateEvaluatorVersionParams =
  WithClient<CreateTemplateEvaluatorVersionInput>;

/**
 * Create a new template version of an existing evaluator.
 *
 * The new version becomes the latest version immediately. Versions are
 * immutable once created; to change the configuration, create a new version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param evaluator - The evaluator name or ID.
 * @param space - An optional space name or ID (required when resolving by evaluator name).
 * @param commitMessage - A message describing the changes in this version.
 * @param templateConfig - The updated LLM template configuration.
 * @returns The created {@link EvaluatorVersion}.
 * @throws Error if the version cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createTemplateEvaluatorVersion } from "@arizeai/ax-client"
 *
 * const version = await createTemplateEvaluatorVersion({
 *   evaluator: "Relevance",
 *   space: "my-space",
 *   commitMessage: "Updated prompt template",
 *   templateConfig: {
 *     name: "Relevance",
 *     template: "Rate the relevance of the response.\nQuery: {{query}}\nResponse: {{response}}",
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
 * console.log(version);
 * ```
 */
export async function createTemplateEvaluatorVersion(
  params: CreateTemplateEvaluatorVersionParams,
): Promise<EvaluatorVersion> {
  warnPreRelease({
    functionName: "createTemplateEvaluatorVersion",
    stage: "beta",
  });
  const {
    client: clientInstance,
    evaluator,
    space,
    commitMessage,
    templateConfig,
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
      template_config: templateConfigToRaw(templateConfig),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformEvaluatorVersion(response.data);
}
