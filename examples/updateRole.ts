import { updateRole } from "../src/roles";

(async () => {
  try {
    const role = await updateRole({
      roleId: "your_role_id",
      permissions: ["PROJECT_READ", "DATASET_READ"],
    });
    // eslint-disable-next-line no-console
    console.log("Role updated:");
    // eslint-disable-next-line no-console
    console.dir(role, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating role:", error);
  }
})();
