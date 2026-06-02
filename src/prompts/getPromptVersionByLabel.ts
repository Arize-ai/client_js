import { createClient } from "../client";
import { WithClient } from "../types";
import { PromptVersion } from "../types/prompts";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { findPromptId, toSpaceRef } from "../utils/resolve";
import { transformPromptVersion } from "./utils";

export type GetPromptVersionByLabelParams = WithClient<{
  prompt: string;
  space?: string;
  labelName: string;
}>;

/**
 * Resolve a label on a prompt to the version it points to.
 *
 * Returns the full {@link PromptVersion} that this label currently references.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param prompt - The name or ID of the prompt.
 * @param space - An optional space name or ID (required when resolving a prompt by name).
 * @param labelName - The label name to resolve (e.g., "production", "staging").
 * @returns The {@link PromptVersion} pointed to by the label.
 * @throws Error if the label cannot be resolved or the response is invalid.
 * @example
 * ```typescript
 * import { getPromptVersionByLabel } from "@arizeai/ax-client"
 *
 * const version = await getPromptVersionByLabel({
 *   prompt: "customer-support",
 *   space: "my-space",
 *   labelName: "production",
 * });
 * console.log(version);
 * ```
 */
export async function getPromptVersionByLabel({
  client: clientInstance,
  prompt,
  space,
  labelName,
}: GetPromptVersionByLabelParams): Promise<PromptVersion> {
  warnPreRelease({ functionName: "getPromptVersionByLabel", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const promptId = await findPromptId(client, prompt, spaceRef);
  const response = await client.GET(
    "/v2/prompts/{prompt_id}/labels/{label_name}",
    {
      params: {
        path: { prompt_id: promptId, label_name: labelName },
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformPromptVersion(response.data);
}
