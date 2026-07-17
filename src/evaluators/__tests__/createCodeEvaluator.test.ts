import { describe, expect, it, vi } from "vitest";
import { createCodeEvaluator } from "../createCodeEvaluator";
import { mockCodeEvaluatorId, mockCodeVersionId } from "./fixtures";

// Valid base64 global ID for a space (decodes to "Space:1") — bypasses GET lookup
const mockSpaceGlobalId = "U3BhY2U6MQ==";

const mockManagedCodeConfig = {
  type: "MANAGED" as const,
  name: "json_parseable",
  managedEvaluator: "JSON_PARSEABLE" as const,
  variables: ["output"],
};

const mockResponseData = {
  id: mockCodeEvaluatorId,
  name: "JSON Parseable",
  description: null,
  type: "CODE" as const,
  space_id: mockSpaceGlobalId,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  created_by_user_id: null,
  version: {
    id: mockCodeVersionId,
    evaluator_id: mockCodeEvaluatorId,
    commit_hash: "ghi789",
    commit_message: "Initial code version",
    type: "CODE" as const,
    code_config: {
      type: "MANAGED" as const,
      name: "json_parseable",
      managed_evaluator: "JSON_PARSEABLE",
      variables: ["output"],
      static_params: undefined,
      data_granularity: null,
      query_filter: null,
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

describe("createCodeEvaluator", () => {
  it("posts to /v2/evaluators with type=code", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createCodeEvaluator({
      client: mockClient as never,
      name: "JSON Parseable",
      space: mockSpaceGlobalId,
      commitMessage: "Initial code version",
      codeConfig: mockManagedCodeConfig,
    });

    expect(mockClient.POST).toHaveBeenCalledOnce();
    const [path, opts] = mockClient.POST.mock.lastCall!;
    expect(path).toBe("/v2/evaluators");
    expect(opts.body.type).toBe("CODE");
    expect(opts.body.version.commit_message).toBe("Initial code version");
    expect(opts.body.version.code_config).toBeDefined();
    expect(opts.body.version.template_config).toBeUndefined();
  });

  it("returns a transformed EvaluatorWithVersion", async () => {
    const mockClient = makeMockClient(mockResponseData);

    const result = await createCodeEvaluator({
      client: mockClient as never,
      name: "JSON Parseable",
      space: mockSpaceGlobalId,
      commitMessage: "Initial code version",
      codeConfig: mockManagedCodeConfig,
    });

    expect(result.id).toBe(mockCodeEvaluatorId);
    expect(result.type).toBe("CODE");
    expect(result.version.type).toBe("CODE");
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("forwards description when provided", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createCodeEvaluator({
      client: mockClient as never,
      name: "JSON Parseable",
      space: mockSpaceGlobalId,
      commitMessage: "Initial code version",
      codeConfig: mockManagedCodeConfig,
      description: "Checks JSON parseability",
    });

    const [, opts] = mockClient.POST.mock.lastCall!;
    expect(opts.body.description).toBe("Checks JSON parseability");
  });
});
