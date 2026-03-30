import { isBase64Id } from "./resolve";

/**
 * Resolve a `space` convenience parameter into separate `spaceId` / `spaceName`
 * values suitable for the REST API query string.
 *
 * Detection heuristic:
 * - If the value is a base64-encoded resource ID, it is treated as a space **ID**.
 * - Otherwise it is treated as a space **name** (substring filter).
 */
export function resolveSpace(space: string | undefined): {
  spaceId: string | undefined;
  spaceName: string | undefined;
} {
  if (space == null) {
    return { spaceId: undefined, spaceName: undefined };
  }
  if (isBase64Id(space)) {
    return { spaceId: space, spaceName: undefined };
  }
  return { spaceId: undefined, spaceName: space };
}
