import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAgentIntegration, mockLlmIntegration } from "./fixtures";
import { listIntegrations } from "../listIntegrations";

describe("listIntegrations", () => {
  const get = vi.fn();

  const mockClient = {
    GET: get,
  } as never;

  beforeEach(() => {
    get.mockReset();
    get.mockResolvedValue({
      error: undefined,
      data: {
        integrations: [mockLlmIntegration, mockAgentIntegration],
        pagination: { has_more: false, next_cursor: null, total_count: 2 },
      },
    });
  });

  it("sends the type filter when provided", async () => {
    await listIntegrations({ client: mockClient, type: "LLM" });

    expect(get).toHaveBeenCalledTimes(1);
    const [, options] = get.mock.calls[0];
    expect(options.params.query.type).toBe("LLM");
  });

  it("omits the type filter and returns the merged multi-type list", async () => {
    const result = await listIntegrations({ client: mockClient });

    expect(get).toHaveBeenCalledTimes(1);
    const [, options] = get.mock.calls[0];
    expect(options.params.query.type).toBeUndefined();

    expect(result.data.map((integration) => integration.type)).toEqual([
      "LLM",
      "AGENT",
    ]);
  });
});
