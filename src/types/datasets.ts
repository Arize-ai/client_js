import {
  RawCreateDatasetRequestBodyExample,
  RawUpdateDatasetRequestBodyExample,
} from "./internal";

export type DatasetVersion = {
  id: string;
  name: string;
  datasetId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Dataset = {
  id: string;
  name: string;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
  versions?: DatasetVersion[];
};

export type DatasetExample = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} & {
  [key: string]: number | string | boolean | Date;
};

export type DatasetExampleInput = RawCreateDatasetRequestBodyExample;

export type DatasetExampleUpdate = RawUpdateDatasetRequestBodyExample;
