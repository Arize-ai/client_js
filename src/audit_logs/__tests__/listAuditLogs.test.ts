import { beforeEach, describe, expect, it, vi } from "vitest";
import { listAuditLogs } from "../listAuditLogs";
import { mockRawAuditLog, mockRawAuditLogMinimal } from "./fixtures";

describe("listAuditLogs", () => {
  const get = vi.fn();

  const mockClient = {
    GET: get,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    get.mockReset();
    get.mockResolvedValue({
      error: undefined,
      data: {
        logs: [mockRawAuditLog],
        pagination: { has_more: false, next_cursor: null },
      },
    });
  });

  it("calls GET /v2/audit-logs with default params when none provided", async () => {
    await listAuditLogs({ client: mockClient });

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(
      "/v2/audit-logs",
      expect.objectContaining({
        params: {
          query: expect.objectContaining({ limit: 50 }),
        },
      }),
    );
  });

  it("forwards userId and operationType filters", async () => {
    await listAuditLogs({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
      operationType: "MUTATION",
    });

    expect(get).toHaveBeenCalledWith(
      "/v2/audit-logs",
      expect.objectContaining({
        params: {
          query: expect.objectContaining({
            user_id: "VXNlcjoxMjM0NQ==",
            operation_type: "MUTATION",
          }),
        },
      }),
    );
  });

  it("converts Date startTime/endTime to ISO strings", async () => {
    const start = new Date("2026-05-01T00:00:00Z");
    const end = new Date("2026-05-31T23:59:59Z");

    await listAuditLogs({ client: mockClient, startTime: start, endTime: end });

    expect(get).toHaveBeenCalledWith(
      "/v2/audit-logs",
      expect.objectContaining({
        params: {
          query: expect.objectContaining({
            start_time: "2026-05-01T00:00:00.000Z",
            end_time: "2026-05-31T23:59:59.000Z",
          }),
        },
      }),
    );
  });

  it("passes string startTime/endTime through as-is", async () => {
    await listAuditLogs({
      client: mockClient,
      startTime: "2026-05-01T00:00:00Z",
      endTime: "2026-05-31T23:59:59Z",
    });

    expect(get).toHaveBeenCalledWith(
      "/v2/audit-logs",
      expect.objectContaining({
        params: {
          query: expect.objectContaining({
            start_time: "2026-05-01T00:00:00Z",
            end_time: "2026-05-31T23:59:59Z",
          }),
        },
      }),
    );
  });

  it("returns transformed AuditLog with camelCase fields", async () => {
    const result = await listAuditLogs({ client: mockClient });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toMatchObject({
      id: "QXVkaXRMb2c6NDI=",
      userId: "VXNlcjoxMjM0NQ==",
      ip: "1.2.3.4",
      operationType: "QUERY",
      operationName: "getSpans",
      operationText: "query getSpans { ... }",
      variables: "{}",
    });
    expect(result.data[0]?.createdAt).toBeInstanceOf(Date);
  });

  it("handles minimal audit log (no optional fields)", async () => {
    get.mockResolvedValue({
      error: undefined,
      data: {
        logs: [mockRawAuditLogMinimal],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    const result = await listAuditLogs({ client: mockClient });

    expect(result.data[0]).toMatchObject({
      id: "QXVkaXRMb2c6OTk=",
      userId: "VXNlcjo5OTk=",
      ip: "5.6.7.8",
      operationType: "MUTATION",
    });
    expect(result.data[0]?.operationName).toBeUndefined();
  });

  it("returns pagination metadata", async () => {
    get.mockResolvedValue({
      error: undefined,
      data: {
        logs: [],
        pagination: { has_more: true, next_cursor: "cursor-abc" },
      },
    });

    const result = await listAuditLogs({ client: mockClient });

    expect(result.pagination.hasMore).toBe(true);
    expect(result.pagination.nextCursor).toBe("cursor-abc");
  });

  it("throws when the API returns an error", async () => {
    get.mockResolvedValue({
      error: { detail: "account admin required", title: "Forbidden" },
      data: undefined,
    });

    await expect(listAuditLogs({ client: mockClient })).rejects.toThrow(
      "account admin required",
    );
  });
});
