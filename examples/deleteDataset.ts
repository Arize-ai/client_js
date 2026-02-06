import { deleteDataset } from "../src/datasets";

(async () => {
  try {
    await deleteDataset({
      datasetId: "your_dataset_id",
    });
    // eslint-disable-next-line no-console
    console.log("Dataset deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting dataset:", error);
  }
})();
