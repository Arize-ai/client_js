import { createClient } from "../client";
import { WithClient } from "../types";
import { PromptVersion } from "../types/prompts";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { transformPromptVersion } from "./utils";

export type GetPromptVersionParams = WithClient<{
  versionId: string;
}>;

/**
 * Get a single prompt version by its ID.
 *
 * Version IDs are pure IDs with no name resolution.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param versionId - The ID of the prompt version to retrieve.
 * @returns The {@link PromptVersion}.
 * @throws Error if the version cannot be retrieved or the response is invalid.
 * @example
 * ```typescript
 * import { getPromptVersion } from "@arizeai/ax-client"
 *
 * const version = await getPromptVersion({
 *   versionId: "UHJvbXB0VmVyc2lvbjoxMjM0NQ==",
 * });
 * console.log(version);
 * ```
 */
export async function getPromptVersion({
  client: clientInstance,
  versionId,
}: GetPromptVersionParams): Promise<PromptVersion> {
  warnPreRelease({ functionName: "getPromptVersion", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/prompt-versions/{version_id}", {
    params: { path: { version_id: versionId } },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformPromptVersion(response.data);
}
