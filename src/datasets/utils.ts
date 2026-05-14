import {
  Dataset,
  DatasetExample,
  DatasetVersion,
  DatasetVersionWithExampleIds,
} from "../types";
import {
  RawDataset,
  RawDatasetVersion,
  RawDatasetVersionWithExampleIds,
  RawListExamplesResponse,
} from "../types/internal";
import { transformAnnotation } from "../spans/utils";

function transformVersion(version: RawDatasetVersion): DatasetVersion {
  const { created_at, updated_at, dataset_id, ...rest } = version;
  return {
    ...rest,
    datasetId: dataset_id,
    createdAt: new Date(created_at),
    updatedAt: new Date(updated_at),
  };
}

export function transformDataset(dataset: RawDataset): Dataset {
  const datasetInfo = {
    id: dataset.id,
    name: dataset.name,
    spaceId: dataset.space_id,
    createdAt: new Date(dataset.created_at),
    updatedAt: new Date(dataset.updated_at),
  };

  if (dataset.versions) {
    return {
      ...datasetInfo,
      versions: dataset.versions.map(transformVersion),
    };
  }

  return datasetInfo;
}

export function transformDatasetVersionWithExampleIds(
  dataset: RawDatasetVersionWithExampleIds,
): DatasetVersionWithExampleIds {
  return {
    id: dataset.id,
    name: dataset.name,
    spaceId: dataset.space_id,
    createdAt: new Date(dataset.created_at),
    updatedAt: new Date(dataset.updated_at),
    datasetVersionId: dataset.dataset_version_id,
    exampleIds: dataset.example_ids,
  };
}

export function transformListDatasetExamplesResponseExample(
  example: RawListExamplesResponse["examples"][number],
): DatasetExample {
  const { created_at, updated_at, annotations, ...rest } = example;
  return {
    ...rest,
    createdAt: new Date(created_at),
    updatedAt: new Date(updated_at),
    ...(annotations && { annotations: annotations.map(transformAnnotation) }),
  };
}
