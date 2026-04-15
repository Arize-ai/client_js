import { unrestrictResource } from "../src/resource_restrictions";

(async () => {
  try {
    await unrestrictResource({ resourceId: "your_project_id" });
    // eslint-disable-next-line no-console
    console.log("Resource unrestricted.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error unrestricting resource:", error);
  }
})();
