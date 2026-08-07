import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { mockLlmIntegration } from "./fixtures";
import { updateIntegration } from "../updateIntegration";

describe("updateIntegration", () => {
  const patch = vi.fn();

  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockLlmIntegration,
    });
    vi.spyOn(resolveModule, "findIntegrationId").mockResolvedValue(
      "resolved-integration-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls PATCH with a type-only body plus the provided name", async () => {
    await updateIntegration({
      client: mockClient,
      integration: "Production LLM",
      type: "LLM",
      name: "Renamed",
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith("/v2/integrations/{integration_id}", {
      params: { path: { integration_id: "resolved-integration-id" } },
      body: {
        type: "LLM",
        name: "Renamed",
        scopings: undefined,
        config: undefined,
      },
    });
  });

  it("throws and skips the API call when no LLM update fields are provided", async () => {
    await expect(
      updateIntegration({
        client: mockClient,
        integration: "Production LLM",
        type: "LLM",
      }),
    ).rejects.toThrow(/At least one update field must be provided/);

    expect(patch).not.toHaveBeenCalled();
  });

  it("throws and skips the API call when no AGENT update fields are provided", async () => {
    await expect(
      updateIntegration({
        client: mockClient,
        integration: "My Support Agent",
        type: "AGENT",
      }),
    ).rejects.toThrow(/At least one update field must be provided/);

    expect(patch).not.toHaveBeenCalled();
  });

  it("does not treat an AGENT description as an empty update", async () => {
    patch.mockResolvedValue({
      error: undefined,
      data: mockLlmIntegration,
    });

    await updateIntegration({
      client: mockClient,
      integration: "My Support Agent",
      type: "AGENT",
      description: null,
    });

    expect(patch).toHaveBeenCalledTimes(1);
  });

  it("throws when the API returns an error", async () => {
    patch.mockResolvedValue({
      error: { detail: "not found", title: "Error", status: 404 },
      data: undefined,
    });

    await expect(
      updateIntegration({
        client: mockClient,
        integration: "Production LLM",
        type: "LLM",
        name: "x",
      }),
    ).rejects.toThrow("not found");
  });
});
