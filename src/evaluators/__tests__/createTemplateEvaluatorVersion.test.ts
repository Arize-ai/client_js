import { describe, expect, it, vi } from "vitest";
import { createTemplateEvaluatorVersion } from "../createTemplateEvaluatorVersion";
import { mockAiIntegrationId, mockVersionId } from "./fixtures";

// Valid base64 global ID for an evaluator (decodes to "Evaluator:123")
const mockEvaluatorGlobalId = "RXZhbHVhdG9yOjEyMw==";

const mockTemplateConfig = {
  name: "Relevance",
  template: "Is {{output}} relevant?",
  includeExplanations: true,
  useFunctionCallingIfAvailable: false,
  llmConfig: {
    aiIntegrationId: mockAiIntegrationId,
    modelName: "gpt-4o",
    invocationParameters: {},
    providerParameters: {},
  },
};

const mockResponseData = {
  id: mockVersionId,
  evaluator_id: mockEvaluatorGlobalId,
  commit_hash: "abc123",
  commit_message: "v2 update",
  type: "template" as const,
  template_config: {
    name: "Relevance",
    template: "Is {{output}} relevant?",
    include_explanations: true,
    use_function_calling_if_available: false,
    classification_choices: null,
    direction: undefined,
    data_granularity: null,
    llm_config: {
      ai_integration_id: mockAiIntegrationId,
      model_name: "gpt-4o",
      invocation_parameters: {},
      provider_parameters: {},
    },
  },
  created_at: "2024-01-01T00:00:00.000Z",
  created_by_user_id: null,
};

function makeMockClient(data: typeof mockResponseData) {
  return {
    POST: vi.fn().mockResolvedValue({ data, error: undefined }),
  };
}

describe("createTemplateEvaluatorVersion", () => {
  it("posts to /v2/evaluators/{evaluator_id}/versions with template_config", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createTemplateEvaluatorVersion({
      client: mockClient as never,
      evaluator: mockEvaluatorGlobalId,
      commitMessage: "v2 update",
      templateConfig: mockTemplateConfig,
    });

    expect(mockClient.POST).toHaveBeenCalledOnce();
    const [path, opts] = mockClient.POST.mock.lastCall!;
    expect(path).toBe("/v2/evaluators/{evaluator_id}/versions");
    expect(opts.params.path.evaluator_id).toBe(mockEvaluatorGlobalId);
    expect(opts.body.commit_message).toBe("v2 update");
    expect(opts.body.template_config).toBeDefined();
    expect(opts.body.code_config).toBeUndefined();
  });

  it("returns a transformed EvaluatorVersion", async () => {
    const mockClient = makeMockClient(mockResponseData);

    const result = await createTemplateEvaluatorVersion({
      client: mockClient as never,
      evaluator: mockEvaluatorGlobalId,
      commitMessage: "v2 update",
      templateConfig: mockTemplateConfig,
    });

    expect(result.id).toBe(mockVersionId);
    expect(result.type).toBe("template");
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
