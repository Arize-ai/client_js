import { describe, expect, it, vi } from "vitest";
import { createRemoteEvaluatorVersion } from "../createRemoteEvaluatorVersion";
import { mockVersionId } from "./fixtures";

// Valid base64 global IDs — bypass name-based lookups
const mockEvaluatorGlobalId = "RXZhbHVhdG9yOjE="; // decodes to "Evaluator:1"
const mockIntegrationId = "SW50ZWdyYXRpb246cmVtb3RlLWV2YWwtMQ==";

const mockResponseData = {
  id: mockVersionId,
  evaluator_id: mockEvaluatorGlobalId,
  commit_hash: "remote456",
  commit_message: "Switch to new endpoint",
  type: "REMOTE" as const,
  remote_config: { integration_id: mockIntegrationId },
  created_at: "2024-01-01T00:00:00.000Z",
  created_by_user_id: null,
};

function makeMockClient(data: typeof mockResponseData) {
  return {
    POST: vi.fn().mockResolvedValue({ data, error: undefined }),
  };
}

describe("createRemoteEvaluatorVersion", () => {
  it("posts to /v2/evaluators/{evaluator_id}/versions with remote_config", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createRemoteEvaluatorVersion({
      client: mockClient as never,
      evaluator: mockEvaluatorGlobalId,
      integrationId: mockIntegrationId,
      commitMessage: "Switch to new endpoint",
    });

    expect(mockClient.POST).toHaveBeenCalledOnce();
    const [path, opts] = mockClient.POST.mock.lastCall!;
    expect(path).toBe("/v2/evaluators/{evaluator_id}/versions");
    expect(opts.params.path.evaluator_id).toBe(mockEvaluatorGlobalId);
    expect(opts.body.remote_config).toEqual({
      integration_id: mockIntegrationId,
    });
    expect(opts.body.code_config).toBeUndefined();
    expect(opts.body.template_config).toBeUndefined();
  });

  it("forwards commit_message in the request body", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createRemoteEvaluatorVersion({
      client: mockClient as never,
      evaluator: mockEvaluatorGlobalId,
      integrationId: mockIntegrationId,
      commitMessage: "Switch to new endpoint",
    });

    const [, opts] = mockClient.POST.mock.lastCall!;
    expect(opts.body.commit_message).toBe("Switch to new endpoint");
  });

  it("returns a transformed EvaluatorVersion with remoteConfig", async () => {
    const mockClient = makeMockClient(mockResponseData);

    const result = await createRemoteEvaluatorVersion({
      client: mockClient as never,
      evaluator: mockEvaluatorGlobalId,
      integrationId: mockIntegrationId,
      commitMessage: "Switch to new endpoint",
    });

    expect(result.id).toBe(mockVersionId);
    expect(result.type).toBe("REMOTE");
    expect(result.createdAt).toBeInstanceOf(Date);
    if (result.type !== "REMOTE") return;
    expect(result.remoteConfig.integrationId).toBe(mockIntegrationId);
  });
});
