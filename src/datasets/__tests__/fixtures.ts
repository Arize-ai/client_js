import {
  RawDataset,
  RawDatasetExample,
  RawDatasetVersion,
} from "../../types/internal";

const mockDateString = "2021-01-01T00:00:00.000Z";
const mockDatasetId = "test-dataset-id";
const mockDatasetVersionId = "test-version-id";
const mockDatasetName = "test-dataset";
const mockDatasetVersionName = "test-version";
const mockSpaceId = "test-space-id";
const mockExampleId = "test-example-id";

export const mockDatasetVersion: RawDatasetVersion = {
  id: mockDatasetVersionId,
  name: mockDatasetVersionName,
  dataset_id: mockDatasetId,
  created_at: mockDateString,
  updated_at: mockDateString,
};

export const mockDataset: RawDataset = {
  id: mockDatasetId,
  name: mockDatasetName,
  space_id: mockSpaceId,
  created_at: mockDateString,
  updated_at: mockDateString,
  versions: [mockDatasetVersion],
};

export const mockListExamplesResponseExample: RawDatasetExample = {
  id: mockExampleId,
  created_at: mockDateString,
  updated_at: mockDateString,
};
