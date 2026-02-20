import { getDataset } from "../src/datasets";

async function main() {
  try {
    const datasets = await getDataset({ datasetId: "your_dataset_id" });
    // eslint-disable-next-line no-console
    console.dir(datasets, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting dataset:", error);
  }
}

main();
