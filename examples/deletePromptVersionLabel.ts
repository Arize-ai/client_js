import { deletePromptVersionLabel } from "../src/prompts";

(async () => {
  try {
    await deletePromptVersionLabel({
      versionId: "your_version_id",
      labelName: "staging",
    });
    // eslint-disable-next-line no-console
    console.log("Label removed successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error removing prompt version label:", error);
  }
})();
