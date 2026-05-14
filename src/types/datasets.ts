import {
  RawCreateDatasetRequestBodyExample,
  RawUpdateDatasetRequestBodyExample,
} from "./internal";
import { Annotation } from "./spans";

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
  annotations?: Annotation[];
} & {
  [key: string]: number | string | boolean | Date | Annotation[];
};

export type DatasetVersionWithExampleIds = {
  id: string;
  name: string;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
  datasetVersionId: string;
  exampleIds: string[];
};

export type DatasetExampleInput = RawCreateDatasetRequestBodyExample;

export type DatasetExampleUpdate = RawUpdateDatasetRequestBodyExample;
