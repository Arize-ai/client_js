import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { annotateSpans } from "../annotateSpans";

describe("annotateSpans", () => {
  const post = vi.fn();

  const mockClient = {
    POST: post,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    post.mockReset();
    post.mockResolvedValue({ error: undefined, data: undefined });
    vi.spyOn(resolveModule, "findProjectId").mockResolvedValue(
      "resolved-project-id",
    );
  });

  it("calls POST /v2/spans/annotate with correct body", async () => {
    await annotateSpans({
      client: mockClient,
      project: "my-project",
      annotations: [
        {
          recordId: "span-abc",
          values: [{ name: "quality", score: 0.9 }],
        },
      ],
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/v2/spans/annotate", {
      body: {
        project_id: "resolved-project-id",
        annotations: [
          {
            record_id: "span-abc",
            values: [{ name: "quality", score: 0.9 }],
          },
        ],
      },
    });
  });

  it("resolves project name to ID via findProjectId, passing space name through", async () => {
    await annotateSpans({
      client: mockClient,
      project: "my-project",
      space: "my-space",
      annotations: [
        { recordId: "span-1", values: [{ name: "q", score: 1.0 }] },
      ],
    });

    expect(resolveModule.findProjectId).toHaveBeenCalledWith(
      mockClient,
      "my-project",
      { spaceName: "my-space" },
    );
  });

  it("includes start_time in body when startTime is provided", async () => {
    const start = new Date("2024-01-01T00:00:00.000Z");

    await annotateSpans({
      client: mockClient,
      project: "my-project",
      annotations: [
        { recordId: "span-1", values: [{ name: "q", score: 1.0 }] },
      ],
      startTime: start,
    });

    expect(post).toHaveBeenCalledWith(
      "/v2/spans/annotate",
      expect.objectContaining({
        body: expect.objectContaining({
          start_time: "2024-01-01T00:00:00.000Z",
        }),
      }),
    );
  });

  it("includes end_time in body when endTime is provided", async () => {
    const end = new Date("2024-01-31T00:00:00.000Z");

    await annotateSpans({
      client: mockClient,
      project: "my-project",
      annotations: [
        { recordId: "span-1", values: [{ name: "q", score: 1.0 }] },
      ],
      endTime: end,
    });

    expect(post).toHaveBeenCalledWith(
      "/v2/spans/annotate",
      expect.objectContaining({
        body: expect.objectContaining({
          end_time: "2024-01-31T00:00:00.000Z",
        }),
      }),
    );
  });

  it("omits start_time and end_time from body when not provided", async () => {
    await annotateSpans({
      client: mockClient,
      project: "my-project",
      annotations: [
        { recordId: "span-1", values: [{ name: "q", score: 1.0 }] },
      ],
    });

    const body = post.mock.calls[0]?.[1]?.body as Record<string, unknown>;
    expect(body).not.toHaveProperty("start_time");
    expect(body).not.toHaveProperty("end_time");
  });

  it("throws when API returns an error", async () => {
    post.mockResolvedValue({
      error: { detail: "span not found", title: "Not Found" },
      data: undefined,
    });

    await expect(
      annotateSpans({
        client: mockClient,
        project: "my-project",
        annotations: [
          { recordId: "span-missing", values: [{ name: "q", score: 0.0 }] },
        ],
      }),
    ).rejects.toThrow("span not found");
  });

  it("throws when project resolution fails", async () => {
    vi.spyOn(resolveModule, "findProjectId").mockRejectedValue(
      new Error("project 'my-project' not found."),
    );

    await expect(
      annotateSpans({
        client: mockClient,
        project: "my-project",
        space: "my-space",
        annotations: [
          { recordId: "span-1", values: [{ name: "q", score: 1.0 }] },
        ],
      }),
    ).rejects.toThrow("project 'my-project' not found.");
  });
});
