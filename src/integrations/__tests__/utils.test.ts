import { describe, expect, it } from "vitest";
import {
  toRawCreateIntegration,
  toRawScoping,
  toRawUpdateIntegration,
  transformIntegration,
} from "../utils";
import {
  makeLlmIntegration,
  mockAgentIntegration,
  mockLlmIntegration,
  rawLlmConfigs,
} from "./fixtures";

describe("transformIntegration (LLM) shared fields", () => {
  it("maps the discriminator and shared fields", () => {
    const result = transformIntegration(mockLlmIntegration);
    expect(result.type).toBe("LLM");
    expect(result.id).toBe(mockLlmIntegration.id);
    expect(result.name).toBe(mockLlmIntegration.name);
    expect(result.createdByUserId).toBe(mockLlmIntegration.created_by_user_id);
    expect(result.createdAt).toEqual(new Date(mockLlmIntegration.created_at));
    expect(result.updatedAt).toEqual(new Date(mockLlmIntegration.updated_at));
  });

  it("maps scopings to camelCase", () => {
    const result = transformIntegration(mockLlmIntegration);
    expect(result.scopings).toEqual([{ organizationId: null, spaceId: null }]);
  });
});

describe("transformIntegration (LLM) per-provider config", () => {
  it("maps OPEN_AI (api-key style provider)", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.OPEN_AI),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "OPEN_AI",
      hasApiKey: true,
      isFunctionCallingEnabled: true,
    });
  });

  it("maps ANTHROPIC", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.ANTHROPIC),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "ANTHROPIC",
      hasApiKey: false,
      isFunctionCallingEnabled: true,
    });
  });

  it("maps GEMINI", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.GEMINI),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "GEMINI",
      hasApiKey: true,
      isFunctionCallingEnabled: false,
    });
  });

  it("maps AWS_BEDROCK with DEFAULT (role-assumption) auth", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.AWS_BEDROCK_DEFAULT),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "AWS_BEDROCK",
      isDefaultModelsEnabled: true,
      modelNames: ["anthropic.claude-3-sonnet"],
      auth: {
        authType: "DEFAULT",
        roleArn: "arn:aws:iam::123456789012:role/arize",
        externalId: "ext-123",
        baseUrl: null,
      },
    });
  });

  it("maps AWS_BEDROCK with BEARER_TOKEN auth", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.AWS_BEDROCK_BEARER),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "AWS_BEDROCK",
      isDefaultModelsEnabled: false,
      modelNames: ["custom.model"],
      auth: {
        authType: "BEARER_TOKEN",
        hasApiKey: true,
        baseUrl: "https://bedrock.example.com",
      },
    });
  });

  it("maps AWS_BEDROCK with PROXY_WITH_HEADERS auth", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.AWS_BEDROCK_PROXY),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "AWS_BEDROCK",
      isDefaultModelsEnabled: true,
      modelNames: [],
      auth: {
        authType: "PROXY_WITH_HEADERS",
        baseUrl: "https://proxy.example.com",
        headerNames: ["x-api-key", "x-tenant"],
      },
    });
  });

  it("maps CUSTOM (base_url + header_names + models)", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.CUSTOM),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "CUSTOM",
      hasApiKey: true,
      isFunctionCallingEnabled: true,
      baseUrl: "https://custom.example.com/v1",
      headerNames: ["x-custom"],
      isDefaultModelsEnabled: false,
      modelNames: ["gpt-oss-20b"],
    });
  });

  it("maps VERTEX_AI (project fields, no key/function-calling)", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.VERTEX_AI),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "VERTEX_AI",
      projectId: "my-gcp-project",
      location: "us-central1",
      projectAccessLabel: "arize-access",
    });
  });

  it("maps NVIDIA_NIM (nullable base_url)", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.NVIDIA_NIM),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "NVIDIA_NIM",
      hasApiKey: false,
      isFunctionCallingEnabled: true,
      baseUrl: null,
      headerNames: [],
      isDefaultModelsEnabled: true,
      modelNames: ["meta/llama-3.1-8b-instruct"],
    });
  });

  it("maps LITELLM without a default-catalog flag", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.LITELLM),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "LITELLM",
      hasApiKey: true,
      isFunctionCallingEnabled: true,
      baseUrl: "https://litellm.internal:4000",
      headerNames: ["x-team-token"],
      modelNames: ["team-gpt-4o"],
    });
  });

  it("maps FIREWORKS without an endpoint or headers", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.FIREWORKS),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "FIREWORKS",
      hasApiKey: true,
      isFunctionCallingEnabled: true,
      isDefaultModelsEnabled: false,
      modelNames: ["accounts/fireworks/models/glm-5p3"],
    });
  });

  it("maps TOGETHER_AI without an endpoint or headers", () => {
    const result = transformIntegration(
      makeLlmIntegration(rawLlmConfigs.TOGETHER_AI),
    );
    if (result.type !== "LLM") throw new Error("expected LLM");
    expect(result.config).toEqual({
      provider: "TOGETHER_AI",
      hasApiKey: true,
      isFunctionCallingEnabled: true,
      isDefaultModelsEnabled: false,
      modelNames: ["meta-llama/Llama-4-70B-Instruct-Turbo"],
    });
  });
});

describe("transformIntegration (AGENT)", () => {
  it("maps the discriminator, description, and shared fields", () => {
    const result = transformIntegration(mockAgentIntegration);
    expect(result.type).toBe("AGENT");
    if (result.type !== "AGENT") throw new Error("expected AGENT");
    expect(result.description).toBe(mockAgentIntegration.description);
    expect(result.createdByUserId).toBeNull();
  });

  it("maps agent config and nested request presets to camelCase", () => {
    const result = transformIntegration(mockAgentIntegration);
    if (result.type !== "AGENT") throw new Error("expected AGENT");
    expect(result.config.endpoint).toBe("https://agent.example.com/replay");
    expect(result.config.hasHeaders).toBe(true);
    expect(result.config.inputSchema).toEqual({
      type: "object",
      properties: { input: { type: "string" } },
    });
    expect(result.config.requestPresets).toEqual([
      {
        id: "cHJlc2V0OjE=",
        name: "default",
        description: "default preset",
        config: { input: "hello" },
        createdAt: new Date("2026-02-13T21:27:19.055Z"),
        updatedAt: new Date("2026-02-13T21:27:19.279Z"),
      },
    ]);
  });

  it("maps organization/space scopings to camelCase", () => {
    const result = transformIntegration(mockAgentIntegration);
    expect(result.scopings).toEqual([
      { organizationId: "T3JnOjE=", spaceId: "U3BhY2U6NDU2OmRlZg==" },
    ]);
  });
});

describe("toRawScoping", () => {
  it("maps camelCase scoping fields to snake_case", () => {
    expect(toRawScoping({ organizationId: "org", spaceId: "spc" })).toEqual({
      organization_id: "org",
      space_id: "spc",
    });
  });

  it("passes through null values", () => {
    expect(toRawScoping({ organizationId: null, spaceId: null })).toEqual({
      organization_id: null,
      space_id: null,
    });
  });
});

describe("toRawCreateIntegration (LLM)", () => {
  it("builds an OPEN_AI create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Prod OpenAI",
        config: {
          provider: "OPEN_AI",
          apiKey: "sk-123",
          isFunctionCallingEnabled: false,
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Prod OpenAI",
      scopings: undefined,
      config: {
        provider: "OPEN_AI",
        api_key: "sk-123",
        is_function_calling_enabled: false,
      },
    });
  });

  it("builds an ANTHROPIC create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Prod Anthropic",
        config: {
          provider: "ANTHROPIC",
          apiKey: "sk-ant-123",
          isFunctionCallingEnabled: true,
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Prod Anthropic",
      scopings: undefined,
      config: {
        provider: "ANTHROPIC",
        api_key: "sk-ant-123",
        is_function_calling_enabled: true,
      },
    });
  });

  it("builds a GEMINI create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Prod Gemini",
        config: {
          provider: "GEMINI",
          apiKey: "gm-123",
          isFunctionCallingEnabled: false,
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Prod Gemini",
      scopings: undefined,
      config: {
        provider: "GEMINI",
        api_key: "gm-123",
        is_function_calling_enabled: false,
      },
    });
  });

  it("builds an AWS_BEDROCK create body with DEFAULT auth", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Bedrock",
        config: {
          provider: "AWS_BEDROCK",
          auth: {
            authType: "DEFAULT",
            roleArn: "arn:aws:iam::1:role/r",
            externalId: "ext",
          },
          isDefaultModelsEnabled: true,
          modelNames: ["m1"],
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Bedrock",
      scopings: undefined,
      config: {
        provider: "AWS_BEDROCK",
        auth: {
          auth_type: "DEFAULT",
          role_arn: "arn:aws:iam::1:role/r",
          external_id: "ext",
          base_url: undefined,
        },
        is_default_models_enabled: true,
        model_names: ["m1"],
      },
    });
  });

  it("builds an AWS_BEDROCK create body with BEARER_TOKEN auth", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Bedrock",
        config: {
          provider: "AWS_BEDROCK",
          auth: {
            authType: "BEARER_TOKEN",
            apiKey: "bt-123",
            baseUrl: "https://b.example.com",
          },
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Bedrock",
      scopings: undefined,
      config: {
        provider: "AWS_BEDROCK",
        auth: {
          auth_type: "BEARER_TOKEN",
          api_key: "bt-123",
          base_url: "https://b.example.com",
        },
        is_default_models_enabled: undefined,
        model_names: undefined,
      },
    });
  });

  it("builds an AWS_BEDROCK create body with PROXY_WITH_HEADERS auth", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Bedrock",
        config: {
          provider: "AWS_BEDROCK",
          auth: {
            authType: "PROXY_WITH_HEADERS",
            baseUrl: "https://proxy.example.com",
            headers: { "x-key": "v" },
          },
          modelNames: ["m1"],
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Bedrock",
      scopings: undefined,
      config: {
        provider: "AWS_BEDROCK",
        auth: {
          auth_type: "PROXY_WITH_HEADERS",
          base_url: "https://proxy.example.com",
          headers: { "x-key": "v" },
        },
        is_default_models_enabled: undefined,
        model_names: ["m1"],
      },
    });
  });

  it("builds a CUSTOM create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Custom",
        scopings: [{ organizationId: "org", spaceId: null }],
        config: {
          provider: "CUSTOM",
          baseUrl: "https://c.example.com",
          apiKey: "k",
          headers: { "x-h": "v" },
          isDefaultModelsEnabled: true,
          modelNames: ["m1"],
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Custom",
      scopings: [{ organization_id: "org", space_id: null }],
      config: {
        provider: "CUSTOM",
        base_url: "https://c.example.com",
        is_function_calling_enabled: undefined,
        api_key: "k",
        headers: { "x-h": "v" },
        is_default_models_enabled: true,
        model_names: ["m1"],
      },
    });
  });

  it("builds a VERTEX_AI create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Vertex",
        config: {
          provider: "VERTEX_AI",
          projectId: "p",
          location: "us-central1",
          projectAccessLabel: "lbl",
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Vertex",
      scopings: undefined,
      config: {
        provider: "VERTEX_AI",
        project_id: "p",
        location: "us-central1",
        project_access_label: "lbl",
      },
    });
  });

  it("builds an NVIDIA_NIM create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "NIM",
        config: {
          provider: "NVIDIA_NIM",
          baseUrl: "https://nim.example.com",
          isDefaultModelsEnabled: true,
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "NIM",
      scopings: undefined,
      config: {
        provider: "NVIDIA_NIM",
        is_function_calling_enabled: undefined,
        base_url: "https://nim.example.com",
        api_key: undefined,
        headers: undefined,
        is_default_models_enabled: true,
        model_names: undefined,
      },
    });
  });

  it("builds a LITELLM create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "LiteLLM",
        config: {
          provider: "LITELLM",
          baseUrl: "https://litellm.internal:4000",
          apiKey: "sk-litellm-x",
          modelNames: ["team-gpt-4o"],
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "LiteLLM",
      scopings: undefined,
      config: {
        provider: "LITELLM",
        is_function_calling_enabled: undefined,
        base_url: "https://litellm.internal:4000",
        api_key: "sk-litellm-x",
        headers: undefined,
        model_names: ["team-gpt-4o"],
      },
    });
  });

  it("builds a FIREWORKS create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Fireworks",
        config: {
          provider: "FIREWORKS",
          apiKey: "fw-x",
          modelNames: ["accounts/fireworks/models/glm-5p3"],
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Fireworks",
      scopings: undefined,
      config: {
        provider: "FIREWORKS",
        is_function_calling_enabled: undefined,
        api_key: "fw-x",
        is_default_models_enabled: undefined,
        model_names: ["accounts/fireworks/models/glm-5p3"],
      },
    });
  });

  it("builds a TOGETHER_AI create body", () => {
    expect(
      toRawCreateIntegration({
        type: "LLM",
        name: "Together AI",
        config: {
          provider: "TOGETHER_AI",
          apiKey: "ta-x",
          modelNames: ["meta-llama/Llama-4-70B-Instruct-Turbo"],
        },
      }),
    ).toEqual({
      type: "LLM",
      name: "Together AI",
      scopings: undefined,
      config: {
        provider: "TOGETHER_AI",
        is_function_calling_enabled: undefined,
        api_key: "ta-x",
        is_default_models_enabled: undefined,
        model_names: ["meta-llama/Llama-4-70B-Instruct-Turbo"],
      },
    });
  });
});

describe("toRawCreateIntegration (AGENT)", () => {
  it("builds an AGENT create body with nested presets", () => {
    expect(
      toRawCreateIntegration({
        type: "AGENT",
        name: "Agent",
        description: "desc",
        scopings: [{ organizationId: "org", spaceId: null }],
        config: {
          endpoint: "https://a.example.com",
          headers: { "x-key": "v" },
          inputSchema: { type: "object" },
          requestPresets: [{ name: "p1", config: { input: "hi" } }],
        },
      }),
    ).toEqual({
      type: "AGENT",
      name: "Agent",
      description: "desc",
      scopings: [{ organization_id: "org", space_id: null }],
      config: {
        endpoint: "https://a.example.com",
        headers: { "x-key": "v" },
        input_schema: { type: "object" },
        request_presets: [
          { name: "p1", description: undefined, config: { input: "hi" } },
        ],
      },
    });
  });
});

describe("toRawCreateIntegration (EVALUATOR)", () => {
  it("builds an EVALUATOR create body", () => {
    expect(
      toRawCreateIntegration({
        type: "EVALUATOR",
        name: "Evaluator",
        description: "desc",
        scopings: [{ organizationId: "org", spaceId: null }],
        config: {
          endpoint: "https://e.example.com",
          headers: { "x-key": "v" },
          inputSchema: { type: "object" },
        },
      }),
    ).toEqual({
      type: "EVALUATOR",
      name: "Evaluator",
      description: "desc",
      scopings: [{ organization_id: "org", space_id: null }],
      config: {
        endpoint: "https://e.example.com",
        headers: { "x-key": "v" },
        input_schema: { type: "object" },
      },
    });
  });

  it("omits headers when not provided", () => {
    expect(
      toRawCreateIntegration({
        type: "EVALUATOR",
        name: "Evaluator",
        config: {
          endpoint: "https://e.example.com",
          inputSchema: { type: "object" },
        },
      }),
    ).toEqual({
      type: "EVALUATOR",
      name: "Evaluator",
      description: undefined,
      scopings: undefined,
      config: {
        endpoint: "https://e.example.com",
        headers: undefined,
        input_schema: { type: "object" },
      },
    });
  });
});

describe("toRawUpdateIntegration (LLM)", () => {
  it("rotates an OPEN_AI api key (provider echoed for server match)", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "OPEN_AI", apiKey: "sk-new" },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "OPEN_AI",
        api_key: "sk-new",
        is_function_calling_enabled: undefined,
      },
    });
  });

  it("clears an OPEN_AI api key by passing null", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "OPEN_AI", apiKey: null },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "OPEN_AI",
        api_key: null,
        is_function_calling_enabled: undefined,
      },
    });
  });

  it("rotates an ANTHROPIC api key (grouped case fall-through)", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "ANTHROPIC", apiKey: "sk-ant-new" },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "ANTHROPIC",
        api_key: "sk-ant-new",
        is_function_calling_enabled: undefined,
      },
    });
  });

  it("rotates a GEMINI api key (grouped case fall-through)", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "GEMINI", apiKey: "gm-new" },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "GEMINI",
        api_key: "gm-new",
        is_function_calling_enabled: undefined,
      },
    });
  });

  it("replaces AWS_BEDROCK auth wholesale and updates models", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: {
          provider: "AWS_BEDROCK",
          auth: { authType: "BEARER_TOKEN", apiKey: "bt-new" },
          modelNames: ["m2"],
        },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "AWS_BEDROCK",
        auth: {
          auth_type: "BEARER_TOKEN",
          api_key: "bt-new",
          base_url: undefined,
        },
        is_default_models_enabled: undefined,
        model_names: ["m2"],
      },
    });
  });

  it("omits AWS_BEDROCK auth when not provided", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "AWS_BEDROCK", isDefaultModelsEnabled: true },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "AWS_BEDROCK",
        auth: undefined,
        is_default_models_enabled: true,
        model_names: undefined,
      },
    });
  });

  it("clears CUSTOM headers by passing null", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "CUSTOM", headers: null, baseUrl: "https://x" },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "CUSTOM",
        api_key: undefined,
        is_function_calling_enabled: undefined,
        base_url: "https://x",
        headers: null,
        is_default_models_enabled: undefined,
        model_names: undefined,
      },
    });
  });

  it("builds a LITELLM update body without a default-catalog flag", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "LITELLM", modelNames: ["m2"] },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "LITELLM",
        api_key: undefined,
        is_function_calling_enabled: undefined,
        base_url: undefined,
        headers: undefined,
        model_names: ["m2"],
      },
    });
  });

  it("builds a FIREWORKS update body with no endpoint or header fields", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "FIREWORKS", isDefaultModelsEnabled: true },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "FIREWORKS",
        api_key: undefined,
        is_function_calling_enabled: undefined,
        is_default_models_enabled: true,
        model_names: undefined,
      },
    });
  });

  it("builds a TOGETHER_AI update body with no endpoint or header fields", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "TOGETHER_AI", isDefaultModelsEnabled: true },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "TOGETHER_AI",
        api_key: undefined,
        is_function_calling_enabled: undefined,
        is_default_models_enabled: true,
        model_names: undefined,
      },
    });
  });

  it("clears NVIDIA_NIM base_url by passing null (allowed unlike CUSTOM)", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "NVIDIA_NIM", baseUrl: null },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "NVIDIA_NIM",
        api_key: undefined,
        is_function_calling_enabled: undefined,
        base_url: null,
        headers: undefined,
        is_default_models_enabled: undefined,
        model_names: undefined,
      },
    });
  });

  it("deep-merges VERTEX_AI scalar fields", () => {
    expect(
      toRawUpdateIntegration({
        type: "LLM",
        config: { provider: "VERTEX_AI", location: "us-east1" },
      }),
    ).toEqual({
      type: "LLM",
      name: undefined,
      scopings: undefined,
      config: {
        provider: "VERTEX_AI",
        project_id: undefined,
        location: "us-east1",
        project_access_label: undefined,
      },
    });
  });
});

describe("toRawUpdateIntegration (AGENT)", () => {
  it("omits config when not provided (AGENT rename)", () => {
    expect(toRawUpdateIntegration({ type: "AGENT", name: "renamed" })).toEqual({
      type: "AGENT",
      name: "renamed",
      description: undefined,
      scopings: undefined,
      config: undefined,
    });
  });

  it("builds an AGENT update body with replacement presets", () => {
    expect(
      toRawUpdateIntegration({
        type: "AGENT",
        config: {
          endpoint: "https://new.example.com",
          headers: null,
          requestPresets: [{ name: "p2", config: { input: "yo" } }],
        },
      }),
    ).toEqual({
      type: "AGENT",
      name: undefined,
      description: undefined,
      scopings: undefined,
      config: {
        endpoint: "https://new.example.com",
        headers: null,
        input_schema: undefined,
        request_presets: [
          { name: "p2", description: undefined, config: { input: "yo" } },
        ],
      },
    });
  });
});

describe("toRawUpdateIntegration (EVALUATOR)", () => {
  it("omits config when not provided (EVALUATOR rename)", () => {
    expect(
      toRawUpdateIntegration({ type: "EVALUATOR", name: "renamed" }),
    ).toEqual({
      type: "EVALUATOR",
      name: "renamed",
      description: undefined,
      scopings: undefined,
      config: undefined,
    });
  });

  it("builds an EVALUATOR update body clearing headers", () => {
    expect(
      toRawUpdateIntegration({
        type: "EVALUATOR",
        config: {
          endpoint: "https://new.example.com",
          headers: null,
          inputSchema: { type: "object" },
        },
      }),
    ).toEqual({
      type: "EVALUATOR",
      name: undefined,
      description: undefined,
      scopings: undefined,
      config: {
        endpoint: "https://new.example.com",
        headers: null,
        input_schema: { type: "object" },
      },
    });
  });
});
