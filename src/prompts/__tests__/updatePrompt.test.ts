import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { updatePrompt } from "../updatePrompt";
import { mockPrompt } from "./fixtures";

describe("updatePrompt", () => {
  const patch = vi.fn();
  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockPrompt,
    });
    vi.spyOn(resolveModule, "findPromptId").mockResolvedValue(
      "resolved-prompt-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("forwards description: null to clear the description", async () => {
    await updatePrompt({
      client: mockClient,
      prompt: "Customer Support",
      description: null,
    });

    expect(patch).toHaveBeenCalledWith("/v2/prompts/{prompt_id}", {
      params: { path: { prompt_id: "resolved-prompt-id" } },
      body: { description: null },
    });
  });
});
