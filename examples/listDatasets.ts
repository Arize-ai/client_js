import { listDatasets } from "../src/datasets";

const DATASET_LIMIT = 5;

(async () => {
  try {
    const datasets = await listDatasets({ limit: DATASET_LIMIT });
    // eslint-disable-next-line no-console
    console.dir(datasets, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing datasets:", error);
  }
})();
