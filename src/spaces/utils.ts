import { Space } from "../types";
import { RawSpace } from "../types/internal";

export function transformSpace(space: RawSpace): Space {
  const { created_at, ...rest } = space;
  return {
    ...rest,
    createdAt: new Date(created_at),
  };
}
