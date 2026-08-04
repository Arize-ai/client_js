import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { updateEvaluator } from "../updateEvaluator";
import { mockRawEvaluator } from "./fixtures";

describe("updateEvaluator", () => {
  const patch = vi.fn();
  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockRawEvaluator,
    });
    vi.spyOn(resolveModule, "findEvaluatorId").mockResolvedValue(
      "resolved-evaluator-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("forwards description: null to clear the description", async () => {
    await updateEvaluator({
      client: mockClient,
      evaluator: "Relevance",
      description: null,
    });

    expect(patch).toHaveBeenCalledWith("/v2/evaluators/{evaluator_id}", {
      params: { path: { evaluator_id: "resolved-evaluator-id" } },
      body: { name: undefined, description: null },
    });
  });
});
