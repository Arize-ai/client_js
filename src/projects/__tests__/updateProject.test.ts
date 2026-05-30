import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { mockRawProject } from "./fixtures";
import { updateProject } from "../updateProject";

describe("updateProject", () => {
  const patch = vi.fn();

  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockRawProject,
    });
    vi.spyOn(resolveModule, "findProjectId").mockResolvedValue(
      "resolved-project-id",
    );
  });

  it("calls PATCH with the new name in the body", async () => {
    await updateProject({
      client: mockClient,
      project: "my-project",
      name: "renamed-project",
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith("/v2/projects/{project_id}", {
      params: { path: { project_id: "resolved-project-id" } },
      body: { name: "renamed-project" },
    });
  });

  it("returns transformed project on success", async () => {
    const result = await updateProject({
      client: mockClient,
      project: "my-project",
      name: "renamed-project",
    });

    expect(result).toMatchObject({
      id: "test-project-id",
      name: "test-project",
      spaceId: "test-space-id",
    });
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("resolves project by name using the space argument", async () => {
    await updateProject({
      client: mockClient,
      project: "my-project",
      space: "my-space",
      name: "renamed-project",
    });

    expect(resolveModule.findProjectId).toHaveBeenCalledWith(
      mockClient,
      "my-project",
      "my-space",
    );
  });

  it("throws when API returns an error", async () => {
    patch.mockResolvedValue({
      error: { detail: "not found", title: "Error" },
      data: undefined,
    });

    await expect(
      updateProject({
        client: mockClient,
        project: "my-project",
        name: "renamed-project",
      }),
    ).rejects.toThrow("not found");
  });
});
