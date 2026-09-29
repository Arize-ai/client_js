import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { AuthorizationError, NotFoundError } from "../../errors";
import { listTraces } from "../listTraces";
import { mockTrace } from "./fixtures";

const BASE_URL = "http://localhost";
// base64 of "Project:1" — treated as a resource ID, so findProjectId returns
// it as-is without calling /v2/projects.
const PROJECT_ID = "UHJvamVjdDox";

describe("listTraces", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("calls POST /v2/traces with the resolved project_id, time range, filter, and query params", async () => {
    let capturedBody: Record<string, unknown> = {};
    let capturedQuery: Record<string, string> = {};

    nock(BASE_URL)
      .post("/v2/traces", (body) => {
        capturedBody = body as Record<string, unknown>;
        return true;
      })
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, {
        traces: [mockTrace],
        pagination: { next_cursor: "next-cursor", has_more: true },
      });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listTraces({
      client,
      project: PROJECT_ID,
      startTime: new Date("2024-01-01T00:00:00.000Z"),
      endTime: new Date("2024-01-02T00:00:00.000Z"),
      filter: "status_code = 'ERROR'",
      limit: 50,
      cursor: "page-cursor",
    });

    expect(capturedBody).toEqual({
      project_id: PROJECT_ID,
      start_time: "2024-01-01T00:00:00.000Z",
      end_time: "2024-01-02T00:00:00.000Z",
      filter: "status_code = 'ERROR'",
    });
    expect(capturedQuery).toEqual({ limit: "50", cursor: "page-cursor" });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toEqual({
      traceId: mockTrace.trace_id,
      rootSpanId: mockTrace.root_span_id,
      startTime: new Date(mockTrace.start_time!),
      endTime: new Date(mockTrace.end_time!),
      spansTruncated: mockTrace.spans_truncated,
      spans: expect.any(Array),
    });
    expect(result.pagination).toEqual({
      nextCursor: "next-cursor",
      hasMore: true,
    });
  });

  it("defaults limit to 50 and omits cursor/time range/filter when not provided", async () => {
    let capturedBody: Record<string, unknown> = {};
    let capturedQuery: Record<string, string> = {};

    nock(BASE_URL)
      .post("/v2/traces", (body) => {
        capturedBody = body as Record<string, unknown>;
        return true;
      })
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, {
        traces: [],
        pagination: { has_more: false },
      });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listTraces({ client, project: PROJECT_ID });

    expect(capturedBody).toEqual({
      project_id: PROJECT_ID,
      start_time: undefined,
      end_time: undefined,
      filter: undefined,
    });
    expect(capturedQuery).toEqual({ limit: "50" });
    expect(result.data).toEqual([]);
    expect(result.pagination).toEqual({
      nextCursor: undefined,
      hasMore: false,
    });
  });

  it("resolves a project name within a space before listing traces", async () => {
    nock(BASE_URL)
      .get("/v2/projects")
      .query({
        space_name: "my-space",
        name: "My Project",
        limit: "100",
      })
      .reply(200, {
        projects: [{ id: PROJECT_ID, name: "My Project" }],
        pagination: { has_more: false },
      });
    nock(BASE_URL)
      .post("/v2/traces", { project_id: PROJECT_ID })
      .query({ limit: "50" })
      .reply(200, {
        traces: [],
        pagination: { has_more: false },
      });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listTraces({
      client,
      project: "My Project",
      space: "my-space",
    });

    expect(result.data).toEqual([]);
  });

  it("throws NotFoundError when the API returns 404", async () => {
    nock(BASE_URL).post("/v2/traces").query(true).reply(404, {
      status: 404,
      detail: "Project not found",
      title: "Not Found",
    });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      listTraces({ client, project: PROJECT_ID }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws AuthorizationError when the API returns 403", async () => {
    nock(BASE_URL).post("/v2/traces").query(true).reply(403, {
      status: 403,
      title: "Forbidden",
    });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      listTraces({ client, project: PROJECT_ID }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
