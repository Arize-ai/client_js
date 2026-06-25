import { describe, expect, it, vi } from "vitest";
import type { ArizeClient } from "../../types";
import { deleteSpans } from "../deleteSpans";

// Mock the modules that deleteSpans depends on
vi.mock("../../client", () => ({
  createClient: vi.fn(),
}));

vi.mock("../../utils/warning", () => ({
  warnPreRelease: vi.fn(),
}));

vi.mock("../../utils/resolve", () => ({
  findProjectId: vi.fn().mockResolvedValue("resolved-project-id"),
  toSpaceRef: vi.fn().mockReturnValue(undefined),
}));

describe("deleteSpans", () => {
  it("should throw when spanIds is empty", async () => {
    await expect(
      deleteSpans({
        project: "UHJvamVjdDox",
        spanIds: [],
      }),
    ).rejects.toThrow("spanIds must not be empty");
  });

  it("should call DELETE /v2/spans with resolved project ID", async () => {
    const mockDelete = vi.fn().mockResolvedValue({
      data: {
        completed: true,
        deleted_span_ids: ["span-1", "span-2"],
        not_deleted_span_ids: [],
      },
    });
    const mockClient = { DELETE: mockDelete } as unknown as ArizeClient;

    await deleteSpans({
      client: mockClient,
      project: "UHJvamVjdDox",
      spanIds: ["span-1", "span-2"],
    });

    expect(mockDelete).toHaveBeenCalledOnce();
    expect(mockDelete).toHaveBeenCalledWith("/v2/spans", {
      body: {
        project_id: "resolved-project-id",
        span_ids: ["span-1", "span-2"],
      },
    });
  });

  it("should return SpanDeleteResult with deleted and not-deleted IDs", async () => {
    const mockDelete = vi.fn().mockResolvedValue({
      data: {
        completed: true,
        deleted_span_ids: ["span-1"],
        not_deleted_span_ids: ["span-2"],
      },
    });
    const mockClient = { DELETE: mockDelete } as unknown as ArizeClient;

    const result = await deleteSpans({
      client: mockClient,
      project: "UHJvamVjdDox",
      spanIds: ["span-1", "span-2"],
    });

    expect(result.completed).toBe(true);
    expect(result.deletedSpanIds).toEqual(["span-1"]);
    expect(result.notDeletedSpanIds).toEqual(["span-2"]);
  });

  it("should return completed=false when server could not fully process", async () => {
    const mockDelete = vi.fn().mockResolvedValue({
      data: {
        completed: false,
        deleted_span_ids: ["span-1"],
        not_deleted_span_ids: ["span-2"],
      },
    });
    const mockClient = { DELETE: mockDelete } as unknown as ArizeClient;

    const result = await deleteSpans({
      client: mockClient,
      project: "UHJvamVjdDox",
      spanIds: ["span-1", "span-2"],
    });

    expect(result.completed).toBe(false);
    expect(result.deletedSpanIds).toEqual(["span-1"]);
    expect(result.notDeletedSpanIds).toEqual(["span-2"]);
  });

  it("should throw on API error response", async () => {
    const mockDelete = vi.fn().mockResolvedValue({
      error: { status: 404, title: "Not Found", detail: "Project not found" },
    });
    const mockClient = { DELETE: mockDelete } as unknown as ArizeClient;

    await expect(
      deleteSpans({
        client: mockClient,
        project: "UHJvamVjdDox",
        spanIds: ["span-1"],
      }),
    ).rejects.toThrow();
  });
});
