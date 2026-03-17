import { createClient } from "../client";
import { Space, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformSpace } from "./utils";

export type CreateSpaceParams = WithClient<{
  name: string;
  organizationId: string;
  description?: string;
}>;

/**
 * Create a new space.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the space to create.
 * @param organizationId - The organization ID to create the space in.
 * @param description - An optional description for the space.
 * @returns A {@link Space}.
 * @throws Error if the space cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createSpace } from "@arizeai/ax-client"
 *
 * const space = await createSpace({
 *   organizationId: "your_org_id",
 *   name: "your_space_name",
 * });
 * console.log(space);
 * ```
 */
export async function createSpace({
  client: clientInstance,
  name,
  organizationId,
  description,
}: CreateSpaceParams): Promise<Space> {
  warnPreRelease({ functionName: "createSpace" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/spaces", {
    body: {
      name,
      organization_id: organizationId,
      description,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformSpace(response.data);
}
