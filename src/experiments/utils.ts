import { Experiment } from "../types/experiments";
import { RawExperiment } from "../types/internal";

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
