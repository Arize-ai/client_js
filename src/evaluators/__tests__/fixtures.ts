import {
  RawCodeConfig,
  RawEvaluator,
  RawEvaluatorLlmConfig,
  RawEvaluatorVersion,
  RawEvaluatorWithVersion,
  RawTemplateConfig,
} from "../../types/internal";

const mockDateString = "2024-01-01T00:00:00.000Z";

export const mockEvaluatorId = "eval-id-1";
export const mockCodeEvaluatorId = "eval-id-2";
export const mockVersionId = "version-id-1";
export const mockCodeVersionId = "version-id-2";
export const mockSpaceId = "space-id-1";
export const mockUserId = "user-id-1";
export const mockAiIntegrationId = "ai-integration-id-1";

export const mockRawLlmConfig: RawEvaluatorLlmConfig = {
  ai_integration_id: mockAiIntegrationId,
  model_name: "gpt-4o",
  invocation_parameters: { temperature: 0 },
  provider_parameters: {},
};

export const mockRawTemplateConfig: RawTemplateConfig = {
  name: "Relevance",
  template:
    "Is the response relevant?\nQuery: {{query}}\nResponse: {{response}}",
  include_explanations: true,
  use_function_calling_if_available: true,
  classification_choices: { relevant: 1, irrelevant: 0 },
  direction: "maximize",
  data_granularity: "span",
  llm_config: mockRawLlmConfig,
};

export const mockRawTemplateConfigMinimal: RawTemplateConfig = {
  name: "FreeformEval",
  template: "Evaluate the output: {{output}}",
  include_explanations: false,
  use_function_calling_if_available: false,
  classification_choices: null,
  direction: undefined,
  data_granularity: null,
  llm_config: mockRawLlmConfig,
};

export const mockRawManagedCodeConfig: RawCodeConfig = {
  type: "managed",
  name: "contains_all_keywords_eval",
  managed_evaluator: "ContainsAllKeywords",
  variables: ["output"],
  static_params: [
    { name: "keywords", type: "STRING_ARRAY", default_value: ["one", "two"] },
  ],
  data_granularity: "span",
  query_filter: null,
};

export const mockRawCustomCodeConfig: RawCodeConfig = {
  type: "custom",
  name: "custom_eval",
  code: "class MyEvaluator(CodeEvaluator):\n  def evaluate(self, *, output=None, **kwargs): ...",
  imports: "from typing import Any",
  variables: ["output"],
  static_params: undefined,
  data_granularity: null,
  query_filter: null,
};

export const mockRawEvaluatorVersion: RawEvaluatorVersion = {
  id: mockVersionId,
  evaluator_id: mockEvaluatorId,
  commit_hash: "abc123",
  commit_message: "Initial version",
  type: "template",
  template_config: mockRawTemplateConfig,
  created_at: mockDateString,
  created_by_user_id: mockUserId,
};

export const mockRawEvaluatorVersionNullableFields: RawEvaluatorVersion = {
  id: mockVersionId,
  evaluator_id: mockEvaluatorId,
  commit_hash: "def456",
  commit_message: null,
  type: "template",
  template_config: mockRawTemplateConfigMinimal,
  created_at: mockDateString,
  created_by_user_id: null,
};

export const mockRawEvaluatorVersionManagedCode: RawEvaluatorVersion = {
  id: mockCodeVersionId,
  evaluator_id: mockCodeEvaluatorId,
  commit_hash: "ghi789",
  commit_message: "Initial code version",
  type: "code",
  code_config: mockRawManagedCodeConfig,
  created_at: mockDateString,
  created_by_user_id: mockUserId,
};

export const mockRawEvaluatorVersionCustomCode: RawEvaluatorVersion = {
  id: mockCodeVersionId,
  evaluator_id: mockCodeEvaluatorId,
  commit_hash: "jkl012",
  commit_message: "Custom code version",
  type: "code",
  code_config: mockRawCustomCodeConfig,
  created_at: mockDateString,
  created_by_user_id: mockUserId,
};

export const mockRawEvaluator: RawEvaluator = {
  id: mockEvaluatorId,
  name: "Relevance Evaluator",
  description: "Evaluates response relevance",
  type: "template",
  space_id: mockSpaceId,
  created_at: mockDateString,
  updated_at: mockDateString,
  created_by_user_id: mockUserId,
};

export const mockRawEvaluatorNullableFields: RawEvaluator = {
  id: mockEvaluatorId,
  name: "Relevance Evaluator",
  description: null,
  type: "template",
  space_id: mockSpaceId,
  created_at: mockDateString,
  updated_at: mockDateString,
  created_by_user_id: null,
};

export const mockRawCodeEvaluator: RawEvaluator = {
  id: mockCodeEvaluatorId,
  name: "Keyword Evaluator",
  description: "Checks for required keywords",
  type: "code",
  space_id: mockSpaceId,
  created_at: mockDateString,
  updated_at: mockDateString,
  created_by_user_id: mockUserId,
};

export const mockRawEvaluatorWithVersion: RawEvaluatorWithVersion = {
  ...mockRawEvaluator,
  version: mockRawEvaluatorVersion,
};

export const mockRawCodeEvaluatorWithVersion: RawEvaluatorWithVersion = {
  ...mockRawCodeEvaluator,
  version: mockRawEvaluatorVersionManagedCode,
};
