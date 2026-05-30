import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type ResetPasswordParams = WithClient<{
  /** The unique identifier of the user to send a password-reset email to. */
  userId: string;
}>;

/**
 * Trigger a password-reset email for a user.
 *
 * Generates a reset token and sends a password-reset email with a 30-minute link.
 * Returns 400 if the target user authenticates via SSO/SAML or has not yet
 * verified their account.
 *
 * Requires account admin role or USER_UPDATE permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param userId - The unique identifier of the user.
 * @returns void.
 * @throws Error if the password reset cannot be initiated or the response is invalid.
 * @example
 * ```typescript
 * import { resetPassword } from "@arizeai/ax-client"
 *
 * await resetPassword({ userId: "VXNlcjoxMjM0NQ==" });
 * ```
 */
export async function resetPassword({
  client: clientInstance,
  userId,
}: ResetPasswordParams): Promise<void> {
  warnPreRelease({ functionName: "resetPassword", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/users/{user_id}/reset-password", {
    params: {
      path: { user_id: userId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
