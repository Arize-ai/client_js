import { deleteSpans } from "../src/spans";

(async () => {
  try {
    const result = await deleteSpans({
      space: "your_space_name",
      project: "your_project_name",
      spanIds: ["a1b2c3d4e5f6a7b8", "f8e7d6c5b4a39281"],
    });

    // eslint-disable-next-line no-console
    console.log(`Deleted: ${result.deletedSpanIds.length} span(s)`);
    // eslint-disable-next-line no-console
    console.log(`Not deleted: ${result.notDeletedSpanIds.length} span(s)`);

    if (!result.completed) {
      // The server could not fully process all data — retry the original request.
      // The delete is idempotent, so re-submitting already-deleted IDs is safe.
      // eslint-disable-next-line no-console
      console.warn("Delete incomplete — retry the full request.");
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting spans:", error);
  }
})();
