import { describe, expect, it, vi } from "vitest";
import type { ArizeClient } from "../../types";
import { listSpans } from "../listSpans";

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

describe("listSpans", () => {
  it.each([
    {
      name: "included columns",
      projection: { includedColumns: ["attributes.llm.model_name"] },
      body: { included_columns: ["attributes.llm.model_name"] },
    },
    {
      name: "excluded columns",
      projection: { excludedColumns: ["attributes.embedding.vectors"] },
      body: { excluded_columns: ["attributes.embedding.vectors"] },
    },
    {
      name: "truncate string length",
      projection: { truncateStringLength: 200 },
      body: { truncate_string_length: 200 },
    },
  ])("should send $name", async ({ projection, body }) => {
    const post = vi.fn().mockResolvedValue({
      data: {
        spans: [],
        pagination: { has_more: false },
      },
    });
    const client = { POST: post } as unknown as ArizeClient;

    await listSpans({
      client,
      project: "UHJvamVjdDox",
      ...projection,
    });

    expect(post).toHaveBeenCalledWith("/v2/spans", {
      params: { query: { limit: 50, cursor: undefined } },
      body: {
        project_id: "resolved-project-id",
        start_time: undefined,
        end_time: undefined,
        filter: undefined,
        ...body,
      },
    });
  });

  it("should not send truncate_string_length when omitted", async () => {
    const post = vi.fn().mockResolvedValue({
      data: {
        spans: [],
        pagination: { has_more: false },
      },
    });
    const client = { POST: post } as unknown as ArizeClient;

    await listSpans({
      client,
      project: "UHJvamVjdDox",
    });

    expect(post.mock.calls[0]?.[1]?.body).not.toHaveProperty(
      "truncate_string_length",
    );
  });
});
