import { createClient } from "../client";
import { WithClient } from "../types";
import { PromptVersion } from "../types/prompts";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { transformPromptVersion } from "./utils";

export type GetPromptLabelParams = WithClient<{
  promptId: string;
  labelName: string;
}>;

/**
 * Resolve a label on a prompt to the version it points to.
 *
 * Returns the full {@link PromptVersion} that this label currently references.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param promptId - The ID of the prompt.
 * @param labelName - The label name to resolve (e.g., "production", "staging").
 * @returns The {@link PromptVersion} pointed to by the label.
 * @throws Error if the label cannot be resolved or the response is invalid.
 * @example
 * ```typescript
 * import { getPromptLabel } from "@arizeai/ax-client"
 *
 * const version = await getPromptLabel({
 *   promptId: "prompt_12345",
 *   labelName: "production",
 * });
 * console.log(version);
 * ```
 */
export async function getPromptLabel({
  client: clientInstance,
  promptId,
  labelName,
}: GetPromptLabelParams): Promise<PromptVersion> {
  warnPreRelease({ functionName: "getPromptLabel" });
  const client = clientInstance ?? createClient();
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
