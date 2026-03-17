import { createClient } from "../client";
import { Space, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformSpace } from "./utils";

export type GetSpaceParams = WithClient<{
  spaceId: string;
}>;

/**
 * Get the information about a specific space available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - The ID of the space to get.
 * @returns A {@link Space}.
 * @throws Error if the space cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getSpace } from "@arizeai/ax-client"
 *
 * const space = await getSpace({ spaceId: "your_space_id" });
 * console.log(space);
 * ```
 */
export async function getSpace({
  client: clientInstance,
  spaceId,
}: GetSpaceParams): Promise<Space> {
  warnPreRelease({ functionName: "getSpace" });
  const client = clientInstance ?? createClient();
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
