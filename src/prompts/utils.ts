import { Prompt } from "../types";
import { RawPrompt } from "../types/internal";

export function transformPrompt(prompt: RawPrompt): Prompt {
  const { space_id, created_at, updated_at, created_by_user_id, ...rest } =
    prompt;
  return {
    ...rest,
    spaceId: space_id,
    createdAt: new Date(created_at),
    updatedAt: new Date(updated_at),
    createdByUserId: created_by_user_id,
  };
}
