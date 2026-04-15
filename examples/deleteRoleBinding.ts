import { deleteRoleBinding } from "../src/role_bindings";

(async () => {
  try {
    await deleteRoleBinding({ bindingId: "your_binding_id" });
    // eslint-disable-next-line no-console
    console.log("Role binding deleted.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting role binding:", error);
  }
})();
