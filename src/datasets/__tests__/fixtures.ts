import {
  RawDataset,
  RawDatasetExample,
  RawDatasetVersion,
  RawDatasetVersionWithExampleIds,
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

export const mockDatasetVersionWithExampleIds: RawDatasetVersionWithExampleIds =
  {
    id: mockDatasetId,
    name: mockDatasetName,
    space_id: mockSpaceId,
    created_at: mockDateString,
    updated_at: mockDateString,
    dataset_version_id: mockDatasetVersionId,
    example_ids: [mockExampleId],
  };

export const mockListExamplesResponseExample: RawDatasetExample = {
  id: mockExampleId,
  created_at: mockDateString,
  updated_at: mockDateString,
};

export const mockListExamplesResponseExampleWithAnnotations: RawDatasetExample =
  {
    id: mockExampleId,
    created_at: mockDateString,
    updated_at: mockDateString,
    annotations: [
      {
        name: "quality",
        score: 0.9,
        label: "good",
        text: "spot on",
        updated_at: mockDateString,
        annotator: { id: "user-1", email: "u1@example.com" },
      },
      {
        // consensus annotation — no annotator, no updated_at
        name: "accuracy",
        label: "yes",
      },
    ],
  };

export const mockListExamplesResponseExampleWithEmptyAnnotations: RawDatasetExample =
  {
    id: mockExampleId,
    created_at: mockDateString,
    updated_at: mockDateString,
    annotations: [],
  };
