import { createClient } from "../client";
import { Space, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformSpace } from "./utils";

export type UpdateSpaceParams = WithClient<{
  spaceId: string;
  name?: string;
  description?: string;
}>;

/**
 * Update a space's metadata by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - The ID of the space to update.
 * @param name - An optional updated name for the space.
 * @param description - An optional updated description for the space.
 * @returns A {@link Space}.
 * @throws Error if the space cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateSpace } from "@arizeai/ax-client"
 *
 * const space = await updateSpace({
 *   spaceId: "your_space_id",
 *   name: "updated_space_name",
 * });
 * console.log(space);
 * ```
 */
export async function updateSpace({
  client: clientInstance,
  spaceId,
  name,
  description,
}: UpdateSpaceParams): Promise<Space> {
  warnPreRelease({ functionName: "updateSpace" });
  const client = clientInstance ?? createClient();
  const response = await client.PATCH("/v2/spaces/{space_id}", {
    params: {
      path: {
        space_id: spaceId,
      },
    },
    body: {
      name,
      description,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformSpace(response.data);
}
