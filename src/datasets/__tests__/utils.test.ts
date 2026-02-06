import { describe, expect, it } from "vitest";
import {
  transformDataset,
  transformListDatasetExamplesResponseExample,
} from "../utils";
import { mockDataset, mockListExamplesResponseExample } from "./fixtures";

describe("transformDataset", () => {
  it("should transform the created_at and updated_at fields of a dataset and its versions to date objects", () => {
    const expectedResult = {
      id: mockDataset.id,
      name: mockDataset.name,
      spaceId: mockDataset.space_id,
      createdAt: new Date(mockDataset.created_at),
      updatedAt: new Date(mockDataset.updated_at),
      versions: mockDataset.versions?.map((version) => ({
        id: version.id,
        name: version.name,
        datasetId: version.dataset_id,
        createdAt: new Date(version.created_at),
        updatedAt: new Date(version.updated_at),
      })),
    };
    const dataset = transformDataset(mockDataset);
    expect(dataset).toEqual(expectedResult);
  });
});

describe("transformListExamplesResponseExample", () => {
  it("should transform the created_at and updated_at fields of a dataset example to date objects", () => {
    const expectedResult = {
      id: mockListExamplesResponseExample.id,
      createdAt: new Date(mockListExamplesResponseExample.created_at),
      updatedAt: new Date(mockListExamplesResponseExample.updated_at),
    };
    const example = transformListDatasetExamplesResponseExample(
      mockListExamplesResponseExample,
    );
    expect(example).toEqual(expectedResult);
  });
});
