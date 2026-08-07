import {
  Experiment,
  ExperimentRun,
  ExperimentRunInput,
} from "../types/experiments";
import { RawExperiment, RawExperimentRun } from "../types/internal";
import { transformAnnotation } from "../spans/utils";

export function transformExperiment(experiment: RawExperiment): Experiment {
  const experimentInfo: Experiment = {
    id: experiment.id,
    name: experiment.name,
    spaceId: experiment.space_id,
    datasetId: experiment.dataset_id,
    datasetVersionId: experiment.dataset_version_id,
    createdAt: new Date(experiment.created_at),
    updatedAt: new Date(experiment.updated_at),
  };

  if (experiment.experiment_traces_project_id) {
    experimentInfo.experimentTracesProjectId =
      experiment.experiment_traces_project_id;
  }

  // Preserve an explicit `null` (returned for non-agent experiments) so the
  // `string | null` type is accurate; only an absent field stays absent.
  if (experiment.integration_id !== undefined) {
    experimentInfo.integrationId = experiment.integration_id;
  }

  return experimentInfo;
}

export function normalizeExperimentRun(run: ExperimentRunInput) {
  const { exampleId, ...rest } = run;
  return exampleId !== undefined ? { ...rest, example_id: exampleId } : rest;
}

export function transformExperimentRun(run: RawExperimentRun): ExperimentRun {
  const { example_id, annotations, ...rest } = run;
  return {
    ...rest,
    exampleId: example_id,
    ...(annotations && { annotations: annotations.map(transformAnnotation) }),
  };
}
