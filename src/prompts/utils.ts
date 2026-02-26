import { Prompt } from "../types";
import { RawPrompt } from "../types/internal";

export function transformPrompt(prompt: RawPrompt): Prompt {
  return {
    id: prompt.id,
    name: prompt.name,
    description: prompt.description,
    spaceId: prompt.space_id,
    createdAt: new Date(prompt.created_at),
    updatedAt: new Date(prompt.updated_at),
    createdByUserId: prompt.created_by_user_id,
    tags: prompt.tags,
  };
}
