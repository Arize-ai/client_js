import { createClient } from "../client";
import { WithClient } from "../types";
import { handleApiError } from "../errors";
import { PromptVersion } from "../types/prompts";
import { warnPreRelease } from "../utils/warning";
import { transformPromptVersion } from "./utils";

export type SetPromptVersionLabelsParams = WithClient<{
  versionId: string;
  /** Array of label names to set on the version (replaces all existing labels). */
  labels: string[];
}>;

/**
 * Set (replace) all labels on a prompt version.
 *
 * This is an idempotent operation. If a label already exists on another version of the
 * same prompt, it will be moved to this version. Labels not included in the request will
 * be removed from this version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param versionId - The ID of the prompt version.
 * @param labels - Array of label names to set (replaces all existing labels).
 * @returns The updated {@link PromptVersion}.
 * @throws Error if the labels cannot be set or the response is invalid.
 * @example
 * ```typescript
 * import { setPromptVersionLabels } from "@arizeai/ax-client"
 *
 * const version = await setPromptVersionLabels({
 *   versionId: "UHJvbXB0VmVyc2lvbjoxMjM0NQ==",
 *   labels: ["production", "staging"],
 * });
 * console.log(version.labels);
 * ```
 */
export async function setPromptVersionLabels({
  client: clientInstance,
  versionId,
  labels,
}: SetPromptVersionLabelsParams): Promise<PromptVersion> {
  warnPreRelease({ functionName: "setPromptVersionLabels", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.PUT("/v2/prompt-versions/{version_id}/labels", {
    params: { path: { version_id: versionId } },
    body: { labels },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformPromptVersion(response.data);
}
