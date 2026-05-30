import { RawProject } from "../../types/internal";

const mockDateString = "2021-01-01T00:00:00.000Z";
const mockProjectId = "test-project-id";
const mockProjectName = "test-project";
const mockSpaceId = "test-space-id";

export const mockRawProject: RawProject = {
  id: mockProjectId,
  name: mockProjectName,
  space_id: mockSpaceId,
  created_at: mockDateString,
};
