import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { deleteOrganization } from "../deleteOrganization";

describe("deleteOrganization", () => {
  const deleteFn = vi.fn();

  const mockClient = {
    DELETE: deleteFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    deleteFn.mockReset();
    deleteFn.mockResolvedValue({
      error: undefined,
      response: new Response(null, { status: 204 }),
    });
    vi.spyOn(resolveModule, "findOrganizationId").mockResolvedValue(
      "resolved-org-id",
    );
  });

  it("calls DELETE with resolved organization id", async () => {
    await deleteOrganization({
      client: mockClient,
      organization: "my-organization",
    });

    expect(deleteFn).toHaveBeenCalledTimes(1);
    expect(deleteFn).toHaveBeenCalledWith("/v2/organizations/{org_id}", {
      params: {
        path: {
          org_id: "resolved-org-id",
        },
      },
    });
  });

  it("throws when API returns error", async () => {
    deleteFn.mockResolvedValue({
      error: { detail: "organization not found", title: "Not Found" },
    });

    await expect(
      deleteOrganization({
        client: mockClient,
        organization: "org-id",
      }),
    ).rejects.toThrow("organization not found");
  });
});
