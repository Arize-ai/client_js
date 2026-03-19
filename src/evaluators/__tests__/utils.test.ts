import { describe, expect, it } from "vitest";
import {
  templateConfigToRaw,
  transformEvaluator,
  transformEvaluatorLlmConfig,
  transformEvaluatorVersion,
  transformEvaluatorWithVersion,
  transformTemplateConfig,
} from "../utils";
import { TemplateConfig } from "../../types";
import {
  mockAiIntegrationId,
  mockEvaluatorId,
  mockRawEvaluator,
  mockRawEvaluatorNullableFields,
  mockRawEvaluatorVersion,
  mockRawEvaluatorVersionNullableFields,
  mockRawEvaluatorWithVersion,
  mockRawLlmConfig,
  mockRawTemplateConfig,
  mockRawTemplateConfigMinimal,
  mockSpaceId,
  mockUserId,
  mockVersionId,
} from "./fixtures";

describe("transformEvaluatorLlmConfig", () => {
  it("transforms snake_case fields to camelCase", () => {
    const result = transformEvaluatorLlmConfig(mockRawLlmConfig);
    expect(result).toEqual({
      aiIntegrationId: mockAiIntegrationId,
      modelName: "gpt-4o",
      invocationParameters: { temperature: 0 },
      providerParameters: {},
    });
  });
});

describe("transformTemplateConfig", () => {
  it("transforms all fields including nested llm_config", () => {
    const result = transformTemplateConfig(mockRawTemplateConfig);
    expect(result).toEqual({
      name: "Relevance",
      template:
        "Is the response relevant?\nQuery: {{query}}\nResponse: {{response}}",
      includeExplanations: true,
      useFunctionCallingIfAvailable: true,
      classificationChoices: { relevant: 1, irrelevant: 0 },
      direction: "maximize",
      dataGranularity: "span",
      llmConfig: {
        aiIntegrationId: mockAiIntegrationId,
        modelName: "gpt-4o",
        invocationParameters: { temperature: 0 },
        providerParameters: {},
      },
    });
  });

  it("passes through null optional fields", () => {
    const result = transformTemplateConfig(mockRawTemplateConfigMinimal);
    expect(result.classificationChoices).toBeNull();
    expect(result.direction).toBeNull();
    expect(result.dataGranularity).toBeNull();
  });
});

describe("transformEvaluatorVersion", () => {
  it("transforms all fields and converts created_at to Date", () => {
    const result = transformEvaluatorVersion(mockRawEvaluatorVersion);
    expect(result).toEqual({
      id: mockVersionId,
      evaluatorId: mockEvaluatorId,
      commitHash: "abc123",
      commitMessage: "Initial version",
      templateConfig: transformTemplateConfig(mockRawTemplateConfig),
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      createdByUserId: mockUserId,
    });
  });

  it("passes through null nullable fields", () => {
    const result = transformEvaluatorVersion(
      mockRawEvaluatorVersionNullableFields,
    );
    expect(result.commitMessage).toBeNull();
    expect(result.createdByUserId).toBeNull();
  });
});

describe("transformEvaluator", () => {
  it("transforms all fields and converts date strings to Date objects", () => {
    const result = transformEvaluator(mockRawEvaluator);
    expect(result).toEqual({
      id: mockEvaluatorId,
      name: "Relevance Evaluator",
      description: "Evaluates response relevance",
      type: "template",
      spaceId: mockSpaceId,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      createdByUserId: mockUserId,
    });
  });

  it("passes through null nullable fields", () => {
    const result = transformEvaluator(mockRawEvaluatorNullableFields);
    expect(result.description).toBeNull();
    expect(result.createdByUserId).toBeNull();
  });
});

describe("transformEvaluatorWithVersion", () => {
  it("includes the transformed version on the evaluator", () => {
    const result = transformEvaluatorWithVersion(mockRawEvaluatorWithVersion);
    expect(result.id).toBe(mockEvaluatorId);
    expect(result.spaceId).toBe(mockSpaceId); // not space_id
    expect(result.createdByUserId).toBe(mockUserId); // not created_by_user_id
    expect(result.version.id).toBe(mockVersionId);
    expect(result.version.evaluatorId).toBe(mockEvaluatorId); // not evaluator_id
    expect(result.version.commitHash).toBe("abc123"); // not commit_hash
    expect(result.version.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

describe("templateConfigToRaw", () => {
  it("converts camelCase fields to snake_case for the API", () => {
    const input: TemplateConfig = {
      name: "Relevance",
      template: "Rate: {{query}}",
      includeExplanations: true,
      useFunctionCallingIfAvailable: false,
      classificationChoices: { yes: 1, no: 0 },
      direction: "maximize",
      dataGranularity: "span",
      llmConfig: {
        aiIntegrationId: mockAiIntegrationId,
        modelName: "gpt-4o",
        invocationParameters: { temperature: 0 },
        providerParameters: {},
      },
    };
    const raw = templateConfigToRaw(input);
    expect(raw.include_explanations).toBe(true);
    expect(raw.use_function_calling_if_available).toBe(false);
    expect(raw.llm_config.ai_integration_id).toBe(mockAiIntegrationId);
    expect(raw.llm_config.model_name).toBe("gpt-4o");
    expect(
      (raw as Record<string, unknown>).includeExplanations,
    ).toBeUndefined();
    expect(
      (raw as Record<string, unknown>).useFunctionCallingIfAvailable,
    ).toBeUndefined();
    expect(raw.classification_choices).toEqual({ yes: 1, no: 0 });
    expect(raw.data_granularity).toBe("span");
    expect(raw.direction).toBe("maximize");
    expect(
      (raw as Record<string, unknown>).classificationChoices,
    ).toBeUndefined();
    expect((raw as Record<string, unknown>).dataGranularity).toBeUndefined();
  });

  it("round-trips through transform → raw without data loss", () => {
    const transformed = transformTemplateConfig(mockRawTemplateConfig);
    const raw = templateConfigToRaw(transformed);
    expect(raw).toEqual(mockRawTemplateConfig);
  });

  it("round-trips minimal config through transform → raw without data loss", () => {
    const transformed = transformTemplateConfig(mockRawTemplateConfigMinimal);
    const raw = templateConfigToRaw(transformed);
    expect(raw).toEqual(mockRawTemplateConfigMinimal);
  });
});
