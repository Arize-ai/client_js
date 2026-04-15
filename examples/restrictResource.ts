import { restrictResource } from "../src/resource_restrictions";

(async () => {
  try {
    const restriction = await restrictResource({
      resourceId: "your_project_id",
    });
    // eslint-disable-next-line no-console
    console.log("Resource restricted:");
    // eslint-disable-next-line no-console
    console.dir(restriction, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error restricting resource:", error);
  }
})();
