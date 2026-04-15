import { getRoleBinding } from "../src/role_bindings";

(async () => {
  try {
    const binding = await getRoleBinding({ bindingId: "your_binding_id" });
    // eslint-disable-next-line no-console
    console.log("Role binding:");
    // eslint-disable-next-line no-console
    console.dir(binding, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting role binding:", error);
  }
})();
