import {
  Experiment,
  ExperimentRun,
  ExperimentRunInput,
} from "../types/experiments";
import { RawExperiment, RawExperimentRun } from "../types/internal";

export function transformExperiment(experiment: RawExperiment): Experiment {
  const experimentInfo = {
    id: experiment.id,
    name: experiment.name,
    datasetId: experiment.dataset_id,
    datasetVersionId: experiment.dataset_version_id,
    createdAt: new Date(experiment.created_at),
    updatedAt: new Date(experiment.updated_at),
  };

  if (experiment.experiment_traces_project_id) {
    return {
      ...experimentInfo,
      experimentTracesProjectId: experiment.experiment_traces_project_id,
    };
  }

  return experimentInfo;
}

export function normalizeExperimentRun(run: ExperimentRunInput) {
  const { exampleId, example_id, ...rest } = run;
  const id = exampleId ?? example_id;
  if (!id) {
    throw new Error("Each experiment run must have an exampleId.");
  }
  if (example_id) {
    // eslint-disable-next-line no-console
    console.warn(
      "example_id is deprecated and will be removed in a future major version. Use exampleId instead.",
    );
  }
  return {
    ...rest,
    example_id: id,
  };
}

export function transformExperimentRun(run: RawExperimentRun): ExperimentRun {
  const { example_id, ...rest } = run;
  return {
    ...rest,
    exampleId: example_id,
    example_id,
  };
}
