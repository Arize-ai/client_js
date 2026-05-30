import { createClient } from "../client";
import { WithClient } from "../types";
import { PromptWithVersion } from "../types/prompts";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { findPromptId, toSpaceRef } from "../utils/resolve";
import { transformPromptWithVersion } from "./utils";

type GetPromptBase = { prompt: string; space?: string };
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
 * Get a specific prompt by its name or ID.
 *
 * The response always includes a resolved version. By default the latest version is returned.
 * Use `versionId` or `label` to resolve a specific version instead.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param prompt - The name or ID of the prompt to get.
 * @param space - An optional space name or ID (required when resolving a prompt by name).
 * @param versionId - An optional version ID to resolve. Mutually exclusive with `label`.
 * @param label - An optional label to resolve (e.g., "production"). Mutually exclusive with `versionId`.
 * @returns A {@link PromptWithVersion} containing the prompt and its resolved version.
 * @throws Error if the prompt cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getPrompt } from "@arizeai/ax-client"
 *
 * // Get latest version
 * const prompt = await getPrompt({ prompt: "customer-support", space: "my-space" });
 *
 * // Get a specific version by label
 * const productionPrompt = await getPrompt({
 *   prompt: "customer-support",
 *   space: "my-space",
 *   label: "production",
 * });
 * console.log(productionPrompt);
 * ```
 */
export async function getPrompt({
  client: clientInstance,
  prompt,
  space,
  versionId,
  label,
}: GetPromptParams): Promise<PromptWithVersion> {
  warnPreRelease({ functionName: "getPrompt", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const promptId = await findPromptId(client, prompt, spaceRef);
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
