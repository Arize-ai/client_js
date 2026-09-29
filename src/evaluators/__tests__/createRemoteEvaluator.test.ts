import { describe, expect, it, vi } from "vitest";
import { createRemoteEvaluator } from "../createRemoteEvaluator";
import { mockVersionId } from "./fixtures";

// Valid base64 global IDs — bypass name-based lookups
const mockSpaceGlobalId = "U3BhY2U6MQ=="; // decodes to "Space:1"
const mockEvaluatorGlobalId = "RXZhbHVhdG9yOjE="; // decodes to "Evaluator:1"
const mockIntegrationId = "SW50ZWdyYXRpb246cmVtb3RlLWV2YWwtMQ==";

const mockResponseData = {
  id: mockEvaluatorGlobalId,
  name: "My Remote Evaluator",
  description: null,
  type: "REMOTE" as const,
  space_id: mockSpaceGlobalId,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  created_by_user_id: null,
  version: {
    id: mockVersionId,
    evaluator_id: mockEvaluatorGlobalId,
    commit_hash: "remote123",
    commit_message: "Initial remote version",
    type: "REMOTE" as const,
    remote_config: { integration_id: mockIntegrationId },
    created_at: "2024-01-01T00:00:00.000Z",
    created_by_user_id: null,
  },
};

function makeMockClient(data: typeof mockResponseData) {
  return {
    POST: vi.fn().mockResolvedValue({ data, error: undefined }),
  };
}

describe("createRemoteEvaluator", () => {
  it("posts to /v2/evaluators with type=REMOTE and remote_config", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createRemoteEvaluator({
      client: mockClient as never,
      name: "My Remote Evaluator",
      space: mockSpaceGlobalId,
      integrationId: mockIntegrationId,
      commitMessage: "Initial remote version",
    });

    expect(mockClient.POST).toHaveBeenCalledOnce();
    const [path, opts] = mockClient.POST.mock.lastCall!;
    expect(path).toBe("/v2/evaluators");
    expect(opts.body.type).toBe("REMOTE");
    expect(opts.body.version.remote_config).toEqual({
      integration_id: mockIntegrationId,
    });
    expect(opts.body.version.code_config).toBeUndefined();
    expect(opts.body.version.template_config).toBeUndefined();
  });

  it("forwards name and space_id in the request body", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createRemoteEvaluator({
      client: mockClient as never,
      name: "My Remote Evaluator",
      space: mockSpaceGlobalId,
      integrationId: mockIntegrationId,
      commitMessage: "Initial remote version",
    });

    const [, opts] = mockClient.POST.mock.lastCall!;
    expect(opts.body.name).toBe("My Remote Evaluator");
    expect(opts.body.space_id).toBe(mockSpaceGlobalId);
  });

  it("forwards commit_message in the version body", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createRemoteEvaluator({
      client: mockClient as never,
      name: "My Remote Evaluator",
      space: mockSpaceGlobalId,
      integrationId: mockIntegrationId,
      commitMessage: "Initial version",
    });

    const [, opts] = mockClient.POST.mock.lastCall!;
    expect(opts.body.version.commit_message).toBe("Initial version");
  });

  it("forwards description when provided", async () => {
    const mockClient = makeMockClient(mockResponseData);

    await createRemoteEvaluator({
      client: mockClient as never,
      name: "My Remote Evaluator",
      space: mockSpaceGlobalId,
      integrationId: mockIntegrationId,
      commitMessage: "Initial remote version",
      description: "Calls a remote endpoint for evaluation",
    });

    const [, opts] = mockClient.POST.mock.lastCall!;
    expect(opts.body.description).toBe(
      "Calls a remote endpoint for evaluation",
    );
  });

  it("returns a transformed EvaluatorWithVersion with remoteConfig", async () => {
    const mockClient = makeMockClient(mockResponseData);

    const result = await createRemoteEvaluator({
      client: mockClient as never,
      name: "My Remote Evaluator",
      space: mockSpaceGlobalId,
      integrationId: mockIntegrationId,
      commitMessage: "Initial remote version",
    });

    expect(result.id).toBe(mockEvaluatorGlobalId);
    expect(result.type).toBe("REMOTE");
    expect(result.version.type).toBe("REMOTE");
    expect(result.createdAt).toBeInstanceOf(Date);
    if (result.version.type !== "REMOTE") return;
    expect(result.version.remoteConfig.integrationId).toBe(mockIntegrationId);
  });
});
