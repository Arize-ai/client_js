import { createClient } from "../client";
import { WithClient } from "../types";
import {
  AnnotateRecordInput,
  AnnotationBatchResult,
} from "../types/annotations";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findDatasetId, findExperimentId, toSpaceRef } from "../utils/resolve";
import { transformAnnotationBatchResult } from "../datasets/utils";

export type AnnotateExperimentRunsParams = WithClient<{
  /**
   * The name or ID of the experiment containing the runs to annotate.
   */
  experiment: string;
  /**
   * An optional dataset name or ID used to resolve `experiment` by name.
   */
  dataset?: string;
  /**
   * An optional space name or ID used to resolve `dataset` by name.
   */
  space?: string;
  /**
   * Batch of annotations to write. Up to 500 runs per request.
   */
  annotations: AnnotateRecordInput[];
}>;

/**
 * Write human annotations to a batch of runs in an experiment.
 *
 * Annotations are upserted by annotation config name for each run.
 * Submitting the same annotation config name for the same run
 * overwrites the previous value. Up to 500 runs may be annotated
 * per request.
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param experiment - The name or base64-encoded ID of the experiment.
 * @param dataset - An optional dataset name or ID used to resolve `experiment` by name.
 * @param space - An optional space name or ID used to resolve `dataset` by name.
 * @param annotations - Batch of {@link AnnotateRecordInput} items. Each item specifies
 *   a `recordId` (experiment run ID) and `values` (list of annotation values to set).
 * @returns An {@link AnnotationBatchResult} with per-record annotation results.
 * @throws Error if the annotations cannot be written or the response is invalid.
 * @example
 * ```typescript
 * import { annotateExperimentRuns } from "@arizeai/ax-client"
 *
 * const result = await annotateExperimentRuns({
 *   space: "my_space",
 *   dataset: "my_dataset",
 *   experiment: "my_experiment",
 *   annotations: [
 *     {
 *       recordId: "run_id_abc123",
 *       values: [
 *         { name: "accuracy", label: "correct", score: 1.0 },
 *         { name: "notes", text: "Well-structured output" },
 *       ],
 *     },
 *   ],
 * });
 * console.log(result);
 * ```
 */
export async function annotateExperimentRuns({
  client: clientInstance,
  experiment,
  dataset,
  space,
  annotations,
}: AnnotateExperimentRunsParams): Promise<AnnotationBatchResult> {
  warnPreRelease({ functionName: "annotateExperimentRuns" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;
  const experimentId = await findExperimentId(client, experiment, datasetId);
  const response = await client.POST(
    "/v2/experiments/{experiment_id}/runs/annotate",
    {
      params: {
        path: { experiment_id: experimentId },
      },
      body: {
        annotations: annotations.map((a) => ({
          record_id: a.recordId,
          values: a.values,
        })),
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationBatchResult(response.data);
}
