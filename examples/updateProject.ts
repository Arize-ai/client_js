import { updateProject } from "../src/projects";

(async () => {
  try {
    const project = await updateProject({
      project: "your_project_id_or_name",
      space: "your_space_name",
      name: "Renamed Project",
    });
    // eslint-disable-next-line no-console
    console.log(project);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating project:", error);
  }
})();
