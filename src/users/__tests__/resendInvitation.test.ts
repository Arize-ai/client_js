import { beforeEach, describe, expect, it, vi } from "vitest";
import { resendInvitation } from "../resendInvitation";

describe("resendInvitation", () => {
  const postFn = vi.fn();

  const mockClient = {
    POST: postFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    postFn.mockReset();
    postFn.mockResolvedValue({
      error: undefined,
      response: new Response(null, { status: 204 }),
    });
  });

  it("calls POST /v2/users/{user_id}/resend-invitation with correct path param", async () => {
    await resendInvitation({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
    });

    expect(postFn).toHaveBeenCalledTimes(1);
    expect(postFn).toHaveBeenCalledWith(
      "/v2/users/{user_id}/resend-invitation",
      {
        params: {
          path: { user_id: "VXNlcjoxMjM0NQ==" },
        },
      },
    );
  });

  it("throws when API returns error", async () => {
    postFn.mockResolvedValue({
      error: { detail: "user is not in invited state", title: "Bad Request" },
    });

    await expect(
      resendInvitation({
        client: mockClient,
        userId: "bad-id",
      }),
    ).rejects.toThrow("user is not in invited state");
  });
});
