import { listPrompts } from "../src/prompts";

(async () => {
  try {
    const { data: prompts, pagination } = await listPrompts({
      spaceId: "your_space_id",
      limit: 10,
    });
    // eslint-disable-next-line no-console
    console.dir({ prompts, pagination }, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing prompts:", error);
  }
})();
