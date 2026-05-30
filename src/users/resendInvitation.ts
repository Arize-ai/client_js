import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type ResendInvitationParams = WithClient<{
  /** The unique identifier of the user whose invitation to resend. */
  userId: string;
}>;

/**
 * Resend the invitation email for a pending user.
 *
 * Regenerates the verification token and sends a fresh email. The target user must
 * be in the `invited` state. Returns 400 if the user has already verified their
 * account or if SAML/IdP login is enforced for the account.
 *
 * Fire-and-forget: a successful response means the token was regenerated and the
 * email dispatch was accepted — delivery failure is logged internally and does not
 * affect the response.
 *
 * Requires account admin role or USER_CREATE permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param userId - The unique identifier of the user.
 * @returns void.
 * @throws Error if the invitation cannot be resent or the response is invalid.
 * @example
 * ```typescript
 * import { resendInvitation } from "@arizeai/ax-client"
 *
 * await resendInvitation({ userId: "VXNlcjoxMjM0NQ==" });
 * ```
 */
export async function resendInvitation({
  client: clientInstance,
  userId,
}: ResendInvitationParams): Promise<void> {
  warnPreRelease({ functionName: "resendInvitation", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/users/{user_id}/resend-invitation", {
    params: {
      path: { user_id: userId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
