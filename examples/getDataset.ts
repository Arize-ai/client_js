import { getDataset } from "../src/datasets";

async function main() {
  try {
    const datasets = await getDataset({
      space: "your_space_name",
      dataset: "your_dataset_name",
    });
    // eslint-disable-next-line no-console
    console.dir(datasets, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting dataset:", error);
  }
}

main();
