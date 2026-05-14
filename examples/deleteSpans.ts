import { deleteSpans } from "../src/spans";

(async () => {
  try {
    await deleteSpans({
      space: "your_space_name",
      project: "your_project_name",
      spanIds: ["a1b2c3d4e5f6a7b8", "f8e7d6c5b4a39281"],
    });
    // eslint-disable-next-line no-console
    console.log("Spans deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting spans:", error);
  }
})();
