import { getRole } from "../src/roles";

(async () => {
  try {
    const role = await getRole({ roleId: "your_role_id" });
    // eslint-disable-next-line no-console
    console.log("Role:");
    // eslint-disable-next-line no-console
    console.dir(role, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting role:", error);
  }
})();
