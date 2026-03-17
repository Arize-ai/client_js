import { createClient } from "../client";
import { WithClient } from "../types";
import { PromptWithVersion } from "../types/prompts";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { transformPromptWithVersion } from "./utils";

type GetPromptBase = { promptId: string };
type GetPromptByVersionId = GetPromptBase & {
  versionId: string;
  label?: never;
};
type GetPromptByLabel = GetPromptBase & { label: string; versionId?: never };
type GetPromptLatest = GetPromptBase & { versionId?: never; label?: never };

/** Params to resolve a prompt. `versionId` and `label` are mutually exclusive. */
export type GetPromptParams = WithClient<
  GetPromptByVersionId | GetPromptByLabel | GetPromptLatest
>;

/**
 * Get a specific prompt by its ID.
 *
 * The response always includes a resolved version. By default the latest version is returned.
 * Use `versionId` or `label` to resolve a specific version instead.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param promptId - The ID of the prompt to get.
 * @param versionId - An optional version ID to resolve. Mutually exclusive with `label`.
 * @param label - An optional label to resolve (e.g., "production"). Mutually exclusive with `versionId`.
 * @returns A {@link PromptWithVersion} containing the prompt and its resolved version.
 * @throws Error if the prompt cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getPrompt } from "@arizeai/ax-client"
 *
 * // Get latest version
 * const prompt = await getPrompt({ promptId: "prompt_12345" });
 *
 * // Get a specific version by label
 * const productionPrompt = await getPrompt({
 *   promptId: "prompt_12345",
 *   label: "production",
 * });
 * console.log(productionPrompt);
 * ```
 */
export async function getPrompt({
  client: clientInstance,
  promptId,
  versionId,
  label,
}: GetPromptParams): Promise<PromptWithVersion> {
  warnPreRelease({ functionName: "getPrompt" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/prompts/{prompt_id}", {
    params: {
      path: { prompt_id: promptId },
      query: { version_id: versionId, label },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformPromptWithVersion(response.data);
}
