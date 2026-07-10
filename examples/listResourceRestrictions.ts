import { listResourceRestrictions } from "../src/resource_restrictions";

(async () => {
  try {
    const restrictions = await listResourceRestrictions();
    // eslint-disable-next-line no-console
    console.log("Resource restrictions:");
    // eslint-disable-next-line no-console
    console.dir(restrictions, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing resource restrictions:", error);
  }
})();
