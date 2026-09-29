import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { deleteEvaluatorVersions } from "../deleteEvaluatorVersions";

describe("deleteEvaluatorVersions", () => {
  const del = vi.fn();

  const mockClient = {
    DELETE: del,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    del.mockReset();
    del.mockResolvedValue({
      error: undefined,
      data: {
        completed: true,
        deleted_version_ids: ["version-1", "version-2"],
        not_deleted_version_ids: ["version-3"],
      },
    });
    vi.spyOn(resolveModule, "findEvaluatorId").mockResolvedValue(
      "resolved-evaluator-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls DELETE with evaluator path param and version IDs in body", async () => {
    await deleteEvaluatorVersions({
      client: mockClient,
      evaluator: "my-evaluator",
      versionIds: ["version-1", "version-2", "version-3"],
    });

    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith("/v2/evaluators/{evaluator_id}/versions", {
      params: { path: { evaluator_id: "resolved-evaluator-id" } },
      body: {
        version_ids: ["version-1", "version-2", "version-3"],
      },
    });
  });

  it("returns transformed result on success", async () => {
    const result = await deleteEvaluatorVersions({
      client: mockClient,
      evaluator: "my-evaluator",
      versionIds: ["version-1", "version-2", "version-3"],
    });

    expect(result).toEqual({
      completed: true,
      deletedVersionIds: ["version-1", "version-2"],
      notDeletedVersionIds: ["version-3"],
    });
  });

  it("resolves evaluator by name using space ref", async () => {
    await deleteEvaluatorVersions({
      client: mockClient,
      evaluator: "my-evaluator",
      space: "my-space",
      versionIds: ["version-1"],
    });

    expect(resolveModule.toSpaceRef).toHaveBeenCalledWith("my-space");
    expect(resolveModule.findEvaluatorId).toHaveBeenCalledWith(
      mockClient,
      "my-evaluator",
      { spaceId: undefined, spaceName: undefined },
    );
  });

  it("throws when versionIds is empty without calling the API", async () => {
    await expect(
      deleteEvaluatorVersions({
        client: mockClient,
        evaluator: "my-evaluator",
        versionIds: [],
      }),
    ).rejects.toThrow("versionIds must not be empty");
    expect(del).not.toHaveBeenCalled();
  });

  it("throws when API returns error", async () => {
    del.mockResolvedValue({
      error: { detail: "not found", title: "Error" },
      data: undefined,
    });

    await expect(
      deleteEvaluatorVersions({
        client: mockClient,
        evaluator: "my-evaluator",
        versionIds: ["version-1"],
      }),
    ).rejects.toThrow("not found");
  });
});
