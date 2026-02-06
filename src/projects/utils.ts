import { Project } from "../types";
import { RawProject } from "../types/internal";

export function transformProject(project: RawProject): Project {
  const { space_id, created_at, ...rest } = project;
  return {
    ...rest,
    spaceId: space_id,
    createdAt: new Date(created_at),
  };
}
