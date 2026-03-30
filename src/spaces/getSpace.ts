import { createClient } from "../client";
import { Space, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { findSpaceId } from "../utils/resolve";
import { handleApiError } from "../errors";
import { transformSpace } from "./utils";

export type GetSpaceParams = WithClient<{
  /** Space ID (e.g. `"spc_abc123"`) or space name. */
  space: string;
}>;

/**
 * Get the information about a specific space.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - The space ID or name.
 * @returns A {@link Space}.
 * @throws Error if the space cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getSpace } from "@arizeai/ax-client"
 *
 * const space = await getSpace({ space: "my-space" });
 * console.log(space);
 * ```
 */
export async function getSpace({
  client: clientInstance,
  space,
}: GetSpaceParams): Promise<Space> {
  warnPreRelease({ functionName: "getSpace" });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.GET("/v2/spaces/{space_id}", {
    params: {
      path: {
        space_id: spaceId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformSpace(response.data);
}
