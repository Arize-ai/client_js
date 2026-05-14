import { describe, expect, it } from "vitest";
import {
  transformDataset,
  transformListDatasetExamplesResponseExample,
} from "../utils";
import {
  mockDataset,
  mockListExamplesResponseExample,
  mockListExamplesResponseExampleWithAnnotations,
  mockListExamplesResponseExampleWithEmptyAnnotations,
} from "./fixtures";

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

  it("omits the annotations key entirely when annotations are absent", () => {
    const example = transformListDatasetExamplesResponseExample(
      mockListExamplesResponseExample,
    );
    expect(example).not.toHaveProperty("annotations");
  });

  it("transforms populated annotations and maps updated_at to a Date", () => {
    const example = transformListDatasetExamplesResponseExample(
      mockListExamplesResponseExampleWithAnnotations,
    );
    expect(example.annotations).toHaveLength(2);
    expect(example.annotations?.[0]).toEqual({
      name: "quality",
      score: 0.9,
      label: "good",
      text: "spot on",
      updatedAt: new Date(
        mockListExamplesResponseExampleWithAnnotations.annotations?.[0]
          ?.updated_at ?? "",
      ),
      annotator: { id: "user-1", email: "u1@example.com" },
    });
    expect(example.annotations?.[1]).toEqual({
      name: "accuracy",
      score: undefined,
      label: "yes",
      text: undefined,
      updatedAt: undefined,
      annotator: undefined,
    });
  });

  it("preserves an empty annotations array rather than dropping it", () => {
    const example = transformListDatasetExamplesResponseExample(
      mockListExamplesResponseExampleWithEmptyAnnotations,
    );
    // Per conditional-spread: empty array is truthy, so the key is kept.
    expect(example.annotations).toEqual([]);
  });
});
