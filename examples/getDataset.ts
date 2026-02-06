import { getDataset } from "../src/datasets/getDataset";

async function main() {
  try {
    const datasets = await getDataset({ datasetId: "16" });
    // eslint-disable-next-line no-console
    console.dir(datasets, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting dataset:", error);
  }
}

main();
