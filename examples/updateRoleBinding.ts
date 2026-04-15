import { updateRoleBinding } from "../src/role_bindings";

(async () => {
  try {
    const binding = await updateRoleBinding({
      bindingId: "your_binding_id",
      roleId: "your_new_role_id",
    });
    // eslint-disable-next-line no-console
    console.log("Role binding updated:");
    // eslint-disable-next-line no-console
    console.dir(binding, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating role binding:", error);
  }
})();
