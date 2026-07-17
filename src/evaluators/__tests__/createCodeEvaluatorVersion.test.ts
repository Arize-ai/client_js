import { describe, expect, it, vi } from "vitest";
import { createCodeEvaluatorVersion } from "../createCodeEvaluatorVersion";
import { mockCodeVersionId } from "./fixtures";

// Valid base64 global ID for a code evaluator (decodes to "Evaluator:456")
const mockCodeEvaluatorGlobalId = "RXZhbHVhdG9yOjQ1Ng==";

const mockManagedCodeConfig = {
  type: "MANAGED" as const,
  name: "json_parseable",
  managedEvaluator: "JSON_PARSEABLE" as const,
  variables: ["output"],
};

const mockResponseData = {
  id: mockCodeVersionId,
  evaluator_id: mockCodeEvaluatorGlobalId,
  commit_hash: "ghi789",
  commit_message: "v2 code update",
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
};

function makeMockClient(data: typeof mockResponseData) {
  return {
    POST: vi.fn().mockResolvedValue({ data, error: undefined }),
  };
}

describe("createCodeEvaluatorVersion", () => {
  it("posts to /v2/evaluators/{evaluator_id}/versions with code_config", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createCodeEvaluatorVersion({
      client: mockClient as never,
      evaluator: mockCodeEvaluatorGlobalId,
      commitMessage: "v2 code update",
      codeConfig: mockManagedCodeConfig,
    });

    expect(mockClient.POST).toHaveBeenCalledOnce();
    const [path, opts] = mockClient.POST.mock.lastCall!;
    expect(path).toBe("/v2/evaluators/{evaluator_id}/versions");
    expect(opts.params.path.evaluator_id).toBe(mockCodeEvaluatorGlobalId);
    expect(opts.body.commit_message).toBe("v2 code update");
    expect(opts.body.code_config).toBeDefined();
    expect(opts.body.template_config).toBeUndefined();
  });

  it("returns a transformed EvaluatorVersion", async () => {
    const mockClient = makeMockClient(mockResponseData);

    const result = await createCodeEvaluatorVersion({
      client: mockClient as never,
      evaluator: mockCodeEvaluatorGlobalId,
      commitMessage: "v2 code update",
      codeConfig: mockManagedCodeConfig,
    });

    expect(result.id).toBe(mockCodeVersionId);
    expect(result.type).toBe("CODE");
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
