import { describe, expect, it, vi } from "vitest";
import { createTemplateEvaluator } from "../createTemplateEvaluator";
import {
  mockAiIntegrationId,
  mockEvaluatorId,
  mockVersionId,
} from "./fixtures";

// Valid base64 global ID for a space (decodes to "Space:1") — bypasses GET lookup
const mockSpaceGlobalId = "U3BhY2U6MQ==";

const mockTemplateConfig = {
  name: "Relevance",
  template: "Is {{output}} relevant?",
  includeExplanations: true,
  useFunctionCallingIfAvailable: false,
  llmConfig: {
    aiIntegrationId: mockAiIntegrationId,
    modelName: "gpt-4o",
    invocationParameters: { temperature: 0 },
    providerParameters: {},
  },
};

const mockResponseData = {
  id: mockEvaluatorId,
  name: "Relevance",
  description: null,
  type: "TEMPLATE" as const,
  space_id: mockSpaceGlobalId,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  created_by_user_id: null,
  version: {
    id: mockVersionId,
    evaluator_id: mockEvaluatorId,
    commit_hash: "abc123",
    commit_message: "Initial version",
    type: "TEMPLATE" as const,
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
        invocation_parameters: { temperature: 0 },
        provider_parameters: {},
      },
    },
    created_at: "2024-01-01T00:00:00.000Z",
    created_by_user_id: null,
  },
};

function makeMockClient(data: typeof mockResponseData) {
  return {
    POST: vi.fn().mockResolvedValue({ data, error: undefined }),
  };
}

describe("createTemplateEvaluator", () => {
  it("posts to /v2/evaluators with type=template", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createTemplateEvaluator({
      client: mockClient as never,
      name: "Relevance",
      space: mockSpaceGlobalId,
      commitMessage: "Initial version",
      templateConfig: mockTemplateConfig,
    });

    expect(mockClient.POST).toHaveBeenCalledOnce();
    const [path, opts] = mockClient.POST.mock.lastCall!;
    expect(path).toBe("/v2/evaluators");
    expect(opts.body.type).toBe("TEMPLATE");
    expect(opts.body.version.commit_message).toBe("Initial version");
    expect(opts.body.version.template_config).toBeDefined();
    expect(opts.body.version.code_config).toBeUndefined();
  });

  it("returns a transformed EvaluatorWithVersion", async () => {
    const mockClient = makeMockClient(mockResponseData);

    const result = await createTemplateEvaluator({
      client: mockClient as never,
      name: "Relevance",
      space: mockSpaceGlobalId,
      commitMessage: "Initial version",
      templateConfig: mockTemplateConfig,
    });

    expect(result.id).toBe(mockEvaluatorId);
    expect(result.type).toBe("TEMPLATE");
    expect(result.version.type).toBe("TEMPLATE");
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("forwards description when provided", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createTemplateEvaluator({
      client: mockClient as never,
      name: "Relevance",
      space: mockSpaceGlobalId,
      commitMessage: "Initial version",
      templateConfig: mockTemplateConfig,
      description: "An LLM evaluator",
    });

    const [, opts] = mockClient.POST.mock.lastCall!;
    expect(opts.body.description).toBe("An LLM evaluator");
  });
});
