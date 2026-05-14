import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetPassword } from "../resetPassword";

describe("resetPassword", () => {
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

  it("calls POST /v2/users/{user_id}/reset-password with correct path param", async () => {
    await resetPassword({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
    });

    expect(postFn).toHaveBeenCalledTimes(1);
    expect(postFn).toHaveBeenCalledWith("/v2/users/{user_id}/reset-password", {
      params: {
        path: { user_id: "VXNlcjoxMjM0NQ==" },
      },
    });
  });

  it("throws when API returns error", async () => {
    postFn.mockResolvedValue({
      error: {
        detail: "user authenticates via SSO and cannot reset password",
        title: "Bad Request",
      },
    });

    await expect(
      resetPassword({
        client: mockClient,
        userId: "bad-id",
      }),
    ).rejects.toThrow("user authenticates via SSO and cannot reset password");
  });
});
