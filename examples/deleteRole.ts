import { deleteRole } from "../src/roles";

(async () => {
  try {
    await deleteRole({ roleId: "your_role_id" });
    // eslint-disable-next-line no-console
    console.log("Role deleted.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting role:", error);
  }
})();
