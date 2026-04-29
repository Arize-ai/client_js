import { deleteOrganization } from "../src/organizations";

(async () => {
  try {
    await deleteOrganization({ organization: "your_organization_name" });
    // eslint-disable-next-line no-console
    console.log("Organization deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting organization:", error);
  }
})();
