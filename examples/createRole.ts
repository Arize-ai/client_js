import { createRole } from "../src/roles";

(async () => {
  try {
    const role = await createRole({
      name: "AI Engineer",
      permissions: ["PROJECT_READ", "DATASET_READ", "DATASET_CREATE"],
      description: "Can read and create datasets and experiments.",
    });
    // eslint-disable-next-line no-console
    console.log("Role created:");
    // eslint-disable-next-line no-console
    console.dir(role, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating role:", error);
  }
})();
