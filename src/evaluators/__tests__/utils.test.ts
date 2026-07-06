import { describe, expect, it } from "vitest";
import {
  codeConfigToRaw,
  templateConfigToRaw,
  transformEvaluator,
  transformEvaluatorLlmConfig,
  transformEvaluatorVersion,
  transformEvaluatorWithVersion,
  transformTemplateConfig,
} from "../utils";
import { CodeConfig, TemplateConfig } from "../../types";
import {
  mockAiIntegrationId,
  mockCodeEvaluatorId,
  mockCodeVersionId,
  mockEvaluatorId,
  mockRawCodeEvaluator,
  mockRawCodeEvaluatorWithVersion,
  mockRawCustomCodeConfig,
  mockRawEvaluator,
  mockRawEvaluatorNullableFields,
  mockRawEvaluatorVersion,
  mockRawEvaluatorVersionCustomCode,
  mockRawEvaluatorVersionHarness,
  mockRawEvaluatorVersionManagedCode,
  mockRawEvaluatorVersionNullableFields,
  mockRawEvaluatorVersionRemote,
  mockRawEvaluatorWithVersion,
  mockRawLlmConfig,
  mockRawManagedCodeConfig,
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
    expect(result.direction).toBeUndefined();
    expect(result.dataGranularity).toBeNull();
  });
});

describe("transformEvaluatorVersion — template branch", () => {
  it("transforms all fields and converts created_at to Date", () => {
    const result = transformEvaluatorVersion(mockRawEvaluatorVersion);
    expect(result).toEqual({
      id: mockVersionId,
      evaluatorId: mockEvaluatorId,
      commitHash: "abc123",
      commitMessage: "Initial version",
      type: "template",
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

describe("transformEvaluatorVersion — managed code branch", () => {
  it("returns a code version with transformed managed code_config", () => {
    const result = transformEvaluatorVersion(
      mockRawEvaluatorVersionManagedCode,
    );
    expect(result.type).toBe("code");
    if (result.type !== "code") return;
    expect(result.id).toBe(mockCodeVersionId);
    expect(result.evaluatorId).toBe(mockCodeEvaluatorId);
    expect(result.codeConfig.type).toBe("managed");
    if (result.codeConfig.type !== "managed") return;
    expect(result.codeConfig.managedEvaluator).toBe("ContainsAllKeywords");
    expect(result.codeConfig.variables).toEqual(["output"]);
    expect(result.codeConfig.staticParams).toEqual([
      { name: "keywords", type: "STRING_ARRAY", defaultValue: ["one", "two"] },
    ]);
    expect(result.codeConfig.dataGranularity).toBe("span");
    expect(result.codeConfig.queryFilter).toBeNull();
  });
});

describe("transformEvaluatorVersion — custom code branch", () => {
  it("returns a code version with transformed custom code_config", () => {
    const result = transformEvaluatorVersion(mockRawEvaluatorVersionCustomCode);
    expect(result.type).toBe("code");
    if (result.type !== "code") return;
    expect(result.codeConfig.type).toBe("custom");
    if (result.codeConfig.type !== "custom") return;
    expect(result.codeConfig.code).toContain("MyEvaluator");
    expect(result.codeConfig.imports).toBe("from typing import Any");
    expect(result.codeConfig.variables).toEqual(["output"]);
    expect(result.codeConfig.staticParams).toBeUndefined();
  });
});

describe("transformEvaluatorVersion — harness branch", () => {
  it("returns a harness version with only common metadata", () => {
    const result = transformEvaluatorVersion(mockRawEvaluatorVersionHarness);
    expect(result).toEqual({
      id: mockVersionId,
      evaluatorId: mockEvaluatorId,
      commitHash: "harness123",
      commitMessage: "Initial harness version",
      type: "harness",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      createdByUserId: mockUserId,
    });
  });
});

describe("transformEvaluatorVersion — remote branch", () => {
  it("returns a remote version with only common metadata", () => {
    const result = transformEvaluatorVersion(mockRawEvaluatorVersionRemote);
    expect(result).toEqual({
      id: mockVersionId,
      evaluatorId: mockEvaluatorId,
      commitHash: "remote123",
      commitMessage: "Initial remote version",
      type: "remote",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      createdByUserId: mockUserId,
    });
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

  it("handles code evaluator type", () => {
    const result = transformEvaluator(mockRawCodeEvaluator);
    expect(result.type).toBe("code");
  });
});

describe("transformEvaluatorWithVersion", () => {
  it("includes the transformed template version on the evaluator", () => {
    const result = transformEvaluatorWithVersion(mockRawEvaluatorWithVersion);
    expect(result.id).toBe(mockEvaluatorId);
    expect(result.spaceId).toBe(mockSpaceId);
    expect(result.createdByUserId).toBe(mockUserId);
    expect(result.version.id).toBe(mockVersionId);
    expect(result.version.evaluatorId).toBe(mockEvaluatorId);
    expect(result.version.commitHash).toBe("abc123");
    expect(result.version.type).toBe("template");
    expect(result.version.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("includes the transformed code version on a code evaluator", () => {
    const result = transformEvaluatorWithVersion(
      mockRawCodeEvaluatorWithVersion,
    );
    expect(result.type).toBe("code");
    expect(result.version.type).toBe("code");
    if (result.version.type !== "code") return;
    expect(result.version.codeConfig.type).toBe("managed");
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

describe("codeConfigToRaw — managed", () => {
  it("serializes managed CodeConfig to raw API shape", () => {
    const input: CodeConfig = {
      type: "managed",
      name: "contains_all_keywords_eval",
      managedEvaluator: "ContainsAllKeywords",
      variables: ["output"],
      staticParams: [
        {
          name: "keywords",
          type: "STRING_ARRAY",
          defaultValue: ["one", "two"],
        },
      ],
      dataGranularity: "span",
      queryFilter: null,
    };
    const raw = codeConfigToRaw(input);
    expect(raw.type).toBe("managed");
    if (raw.type !== "managed") return;
    expect(raw.managed_evaluator).toBe("ContainsAllKeywords");
    expect(raw.variables).toEqual(["output"]);
    expect(raw.name).toBe("contains_all_keywords_eval");
    expect(raw.data_granularity).toBe("span");
  });

  it("round-trips managed config through transform → raw without data loss", () => {
    const transformed = transformEvaluatorVersion(
      mockRawEvaluatorVersionManagedCode,
    );
    if (
      transformed.type !== "code" ||
      transformed.codeConfig.type !== "managed"
    )
      return;
    const raw = codeConfigToRaw(transformed.codeConfig);
    expect(raw.type).toBe("managed");
    if (raw.type !== "managed") return;
    expect(raw.managed_evaluator).toBe(
      mockRawManagedCodeConfig.type === "managed"
        ? mockRawManagedCodeConfig.managed_evaluator
        : undefined,
    );
  });
});

describe("codeConfigToRaw — custom", () => {
  it("serializes custom CodeConfig to raw API shape", () => {
    const input: CodeConfig = {
      type: "custom",
      name: "custom_eval",
      code: "class X(CodeEvaluator): pass",
      imports: "from typing import Any",
      variables: ["output"],
      dataGranularity: null,
      queryFilter: null,
    };
    const raw = codeConfigToRaw(input);
    expect(raw.type).toBe("custom");
    if (raw.type !== "custom") return;
    expect(raw.code).toBe("class X(CodeEvaluator): pass");
    expect(raw.imports).toBe("from typing import Any");
  });

  it("round-trips custom config through transform → raw without data loss", () => {
    const transformed = transformEvaluatorVersion(
      mockRawEvaluatorVersionCustomCode,
    );
    if (transformed.type !== "code" || transformed.codeConfig.type !== "custom")
      return;
    const raw = codeConfigToRaw(transformed.codeConfig);
    expect(raw.type).toBe("custom");
    if (raw.type !== "custom") return;
    expect(raw.code).toBe(
      mockRawCustomCodeConfig.type === "custom"
        ? mockRawCustomCodeConfig.code
        : undefined,
    );
  });
});
