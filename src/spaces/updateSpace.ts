import { createClient } from "../client";
import { Space, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { findSpaceId } from "../utils/resolve";
import { handleApiError } from "../errors";
import { transformSpace } from "./utils";

export type UpdateSpaceParams = WithClient<{
  /** Space ID (e.g. `"U3BhY2U6YWJjMTIz"`) or space name. */
  space: string;
  name?: string;
  description?: string;
}>;

/**
 * Update a space's metadata.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - The space ID or name.
 * @param name - An optional updated name for the space.
 * @param description - An optional updated description for the space.
 * @returns A {@link Space}.
 * @throws Error if the space cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateSpace } from "@arizeai/ax-client"
 *
 * const space = await updateSpace({
 *   space: "my-space",
 *   name: "updated_space_name",
 * });
 * console.log(space);
 * ```
 */
export async function updateSpace({
  client: clientInstance,
  space,
  name,
  description,
}: UpdateSpaceParams): Promise<Space> {
  warnPreRelease({ functionName: "updateSpace", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
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
