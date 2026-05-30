import { createClient } from "../client";
import { WithClient } from "../types";
import { AnnotateRecordInput } from "../types/annotations";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findDatasetId, toSpaceRef } from "../utils/resolve";

export type AnnotateDatasetExamplesParams = WithClient<{
  /**
   * The name or ID of the dataset containing the examples to annotate.
   */
  dataset: string;
  /**
   * An optional space name or ID. Required when `dataset` is a name.
   */
  space?: string;
  /**
   * Batch of annotations to write. Up to 1000 examples per request.
   */
  annotations: AnnotateRecordInput[];
}>;

/**
 * Write human annotations to a batch of examples in a dataset.
 *
 * Annotations are upserted by annotation config name for each example.
 * Submitting the same annotation config name for the same example
 * overwrites the previous value. Up to 1000 examples may be annotated
 * per request.
 *
 * The writes are submitted to the database layer but may not be immediately
 * visible in queries (HTTP 202 Accepted).
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param dataset - The name or ID of the dataset.
 * @param space - An optional space name or ID. Required when `dataset` is a name.
 * @param annotations - Batch of {@link AnnotateRecordInput} items. Each item specifies
 *   a `recordId` (dataset example ID) and `values` (list of annotation values to set).
 * @returns void
 * @throws Error if the annotations cannot be written.
 * @example
 * ```typescript
 * import { annotateDatasetExamples } from "@arizeai/ax-client"
 *
 * await annotateDatasetExamples({
 *   space: "my_space",
 *   dataset: "my_dataset",
 *   annotations: [
 *     {
 *       recordId: "example_id_abc123",
 *       values: [
 *         { name: "quality", score: 0.9 },
 *         { name: "topic", label: "science" },
 *       ],
 *     },
 *   ],
 * });
 * ```
 */
export async function annotateDatasetExamples({
  client: clientInstance,
  dataset,
  space,
  annotations,
}: AnnotateDatasetExamplesParams): Promise<void> {
  warnPreRelease({ functionName: "annotateDatasetExamples", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = await findDatasetId(client, dataset, spaceRef);
  const response = await client.POST(
    "/v2/datasets/{dataset_id}/examples/annotate",
    {
      params: {
        path: { dataset_id: datasetId },
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
}
