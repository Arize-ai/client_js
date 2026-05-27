import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { BulkUserDeletionResult, BulkUserDeletionError } from "../types/users";
import { findUserIdByEmail } from "../utils/resolve";
import { handleApiError } from "../errors";

export type BulkDeleteUsersParams = WithClient<{
  /**
   * List of user global IDs (base64) to delete. Mutually usable with `emails`;
   * both may be provided and results are merged.
   */
  userIds?: string[];
  /**
   * List of user emails to resolve to IDs and then delete. Case-insensitive
   * partial match is used to look up each email — ensure the provided strings
   * are exact email addresses to avoid unintended matches.
   */
  emails?: string[];
}>;

/**
 * Delete multiple users by ID and/or email.
 *
 * This is a client-side orchestration function. It resolves each email to a
 * user ID via {@link findUserIdByEmail}, then calls DELETE for every
 * resolved ID. Individual failures are captured in the result rather than
 * thrown, so callers can inspect which deletions succeeded and which did not.
 *
 * Requires account admin role or USER_DELETE permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param userIds - User global IDs (base64) to delete.
 * @param emails - User emails to resolve and delete.
 * @returns An array of {@link BulkUserDeletionResult} — one entry per
 *   resolved user, indicating whether the deletion succeeded or failed.
 * @throws Error if neither `userIds` nor `emails` is provided, or if the
 *   user listing step itself fails.
 * @example
 * ```typescript
 * import { bulkDeleteUsers } from "@arizeai/ax-client"
 *
 * const results = await bulkDeleteUsers({
 *   emails: ["alice@example.com", "bob@example.com"],
 * });
 * for (const r of results) {
 *   console.log(r.userId, r.status, r.error ?? "");
 * }
 * ```
 */
export async function bulkDeleteUsers({
  client: clientInstance,
  userIds = [],
  emails = [],
}: BulkDeleteUsersParams): Promise<BulkUserDeletionResult[]> {
  warnPreRelease({ functionName: "bulkDeleteUsers" });

  if (userIds.length === 0 && emails.length === 0) {
    throw new Error(
      "bulkDeleteUsers: at least one of `userIds` or `emails` must be provided",
    );
  }

  const client = clientInstance ?? createClient();

  // Resolve emails → user IDs, building a map for result enrichment.
  const idToEmail = new Map<string, string>();
  const notFoundResults: BulkUserDeletionError[] = [];

  for (const email of emails) {
    const userId = await findUserIdByEmail(client, email);
    if (userId === null) {
      notFoundResults.push({
        userId: "",
        email,
        status: "not_found",
        error: `No user found with email: ${email}`,
      });
      continue;
    }
    idToEmail.set(userId, email);
  }

  // Deduplicate: a user provided by both ID and email should only be deleted once.
  const allIds = new Set([...userIds, ...idToEmail.keys()]);

  // Delete by ID (direct + email-resolved), attaching email when available.
  const deleteResults: BulkUserDeletionResult[] = await Promise.all(
    [...allIds].map(async (userId): Promise<BulkUserDeletionResult> => {
      const deleteResponse = await client.DELETE("/v2/users/{user_id}", {
        params: { path: { user_id: userId } },
      });
      if (deleteResponse.error) {
        return handleApiError(deleteResponse);
      }
      const email = idToEmail.get(userId);
      return { userId, email, status: "deleted" };
    }),
  );

  return [...notFoundResults, ...deleteResults];
}
