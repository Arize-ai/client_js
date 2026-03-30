import { deleteDataset } from "../src/datasets";

(async () => {
  try {
    await deleteDataset({
      space: "your_space_name",
      dataset: "your_dataset_name",
    });
    // eslint-disable-next-line no-console
    console.log("Dataset deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting dataset:", error);
  }
})();
