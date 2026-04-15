import { deleteSpace } from "../src/spaces";

(async () => {
  try {
    await deleteSpace({
      space: "your_space_name",
    });
    // eslint-disable-next-line no-console
    console.log("Space deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting space:", error);
  }
})();
