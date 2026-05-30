import { createClient } from "../client";
import { WithClient } from "../types";
import {
  User,
  InviteMode,
  UserCreated,
  UserRoleAssignment,
} from "../types/users";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformUser, transformUserCreated } from "./utils";

export type CreateUserParams = WithClient<{
  /** Full name of the new user. */
  name: string;
  /** Email address of the user to invite. */
  email: string;
  /** Account-level role to assign to the user. */
  role: UserRoleAssignment;
  /**
   * Controls whether and how an invitation is sent.
   * - `"none"` — pre-provision an SSO user directly; no invitation is sent and
   *   the user is immediately active via the configured identity provider.
   * - `"email_link"` — send an email with a verification link to complete registration.
   * - `"temporary_password"` — issue a temporary password (returned in the response);
   *   the user must reset it on first login.
   */
  inviteMode: InviteMode;
  /**
   * Whether the user should have developer permissions (can create GraphQL API keys).
   * Defaults to `true` for `admin` and `member` roles, and `false` for `annotator`.
   */
  isDeveloper?: boolean;
}>;

/**
 * Create a new user with explicit invite control.
 *
 * **Idempotency on email** (when `inviteMode !== "none"`):
 * | Existing state | Result |
 * | --- | --- |
 * | No prior invitation | {@link UserCreated} (201) |
 * | `invited` (pending) | existing {@link User} returned as-is, invitation not resent (200) |
 * | `active` | 409 Conflict |
 * | `expired` | {@link UserCreated} (201) |
 * | `inactive` | 409 Conflict (terminal — cannot be re-invited) |
 *
 * Requires account admin role or USER_CREATE permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The full name of the new user.
 * @param email - The email address of the user to invite.
 * @param role - The account-level role assignment. See {@link UserRoleAssignment}.
 * @param inviteMode - How to invite:
 *   - `"none"` — pre-provision an SSO user directly (no invitation email sent).
 *   - `"email_link"` — send a verification link via email.
 *   - `"temporary_password"` — issue a one-time password returned in the response.
 * @returns A {@link UserCreated} for a new user, or a {@link User} for an existing invitation.
 * @throws Error if the user cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createUser } from "@arizeai/ax-client"
 *
 * const user = await createUser({
 *   name: "Jane Smith",
 *   email: "jane.smith@example.com",
 *   role: { type: "predefined", name: "member" },
 *   inviteMode: "email_link",
 * });
 * console.log(user);
 * ```
 */
export async function createUser({
  client: clientInstance,
  name,
  email,
  role,
  inviteMode,
  isDeveloper,
}: CreateUserParams): Promise<User | UserCreated> {
  warnPreRelease({ functionName: "createUser", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/users", {
    body: {
      name,
      email,
      role,
      invite_mode: inviteMode,
      ...(isDeveloper !== undefined && { is_developer: isDeveloper }),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  if ("invite_mode" in response.data) {
    return transformUserCreated(response.data);
  }
  return transformUser(response.data);
}
