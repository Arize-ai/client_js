import { listRoles } from "../src/roles";

(async () => {
  try {
    const roles = await listRoles();
    // eslint-disable-next-line no-console
    console.log("Roles:");
    // eslint-disable-next-line no-console
    console.dir(roles, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing roles:", error);
  }
})();
