import { listProjects } from "../src/projects";

const PROJECT_LIMIT = 5;

(async () => {
  try {
    const projects = await listProjects({ limit: PROJECT_LIMIT });
    // eslint-disable-next-line no-console
    console.dir(projects, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing projects:", error);
  }
})();
