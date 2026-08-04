import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { updateAiIntegration } from "../updateAiIntegration";
import { mockAiIntegration } from "./fixtures";

describe("updateAiIntegration", () => {
  const patch = vi.fn();
  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockAiIntegration,
    });
    vi.spyOn(resolveModule, "findAiIntegrationId").mockResolvedValue(
      "resolved-integration-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("forwards null for every clearable field", async () => {
    await updateAiIntegration({
      client: mockClient,
      integration: "Production OpenAI",
      apiKey: null,
      baseUrl: null,
      headers: null,
    });

    expect(patch).toHaveBeenCalledWith(
      "/v2/ai-integrations/{integration_id}",
      expect.objectContaining({
        params: { path: { integration_id: "resolved-integration-id" } },
        body: expect.objectContaining({
          api_key: null,
          base_url: null,
          headers: null,
        }),
      }),
    );
  });
});
