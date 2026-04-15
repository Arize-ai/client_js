import { createRoleBinding } from "../src/role_bindings";

(async () => {
  try {
    const binding = await createRoleBinding({
      userId: "your_user_id",
      roleId: "your_role_id",
      resourceType: "PROJECT",
      resourceId: "your_project_id",
    });
    // eslint-disable-next-line no-console
    console.log("Role binding created:");
    // eslint-disable-next-line no-console
    console.dir(binding, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating role binding:", error);
  }
})();
