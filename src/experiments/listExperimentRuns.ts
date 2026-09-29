import { createClient } from "../client";
import { PaginatedResponse, WithClient } from "../types";
import { ExperimentRun } from "../types/experiments";
import { warnPreRelease } from "../utils/warning";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { handleApiError } from "../errors";
import { findDatasetId, findExperimentId, toSpaceRef } from "../utils/resolve";
import { transformExperimentRun } from "./utils";

export type ListExperimentRunsParams = WithClient<{
  experiment: string;
  dataset?: string;
  space?: string;
  filter?: string;
  limit?: number;
  /** Opaque pagination cursor from a previous response's `pagination.next_cursor`. */
  cursor?: string;
}>;

/**
 * List the runs of a specific experiment.
 *
 * Runs are returned in stable `id` ascending order.
 *
 * The filter language supports the unprefixed run columns `id`, `output`, and
 * `example_id`; custom run columns; `eval.<name>.score`, `eval.<name>.label`,
 * `eval.<name>.explanation`, and `eval.<name>.metadata.*`; and
 * `annotation.<name>.*` when those columns are present in the run schema.
 * Omit `filter` to return all runs. A present empty or whitespace-only filter
 * is rejected by the server (400). A malformed or unparseable filter returns
 * 422.
 *
 * Pass `pagination.next_cursor` from the response back as `cursor` to retrieve
 * the next page, keeping the filter unchanged while paging. The cursor is
 * opaque — do not parse or construct it.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param experiment - The experiment name or base64 encoded experiment ID.
 *   When a name is provided, it is resolved to an ID automatically, which
 *   requires either `dataset` or `space`.
 * @param dataset - The dataset name or ID. Resolves `experiment` within that dataset.
 * @param space - The space name or ID. Resolves `experiment` within that space when
 *   `dataset` is omitted — the only option for an experiment with no dataset — and
 *   resolves `dataset` itself when it is a name.
 * @param filter - An optional SQL-like filter expression. Omit to list all runs.
 * @param limit - An optional limit on the number of experiment runs to return
 *   (default 50, min 1, max 500).
 * @param cursor - An optional opaque pagination cursor from a previous response.
 * @returns A {@link PaginatedResponse} of {@link ExperimentRun} objects. Runs of an
 *   experiment with no dataset have no `exampleId`.
 * @throws {AmbiguousNameError} If resolving by `space` alone and the name matches
 *   more than one experiment in that space. Pass `dataset` or an ID to disambiguate.
 * @throws Error if the experiment runs cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listExperimentRuns } from "@arizeai/ax-client"
 *
 * // Using names
 * const result = await listExperimentRuns({ experiment: "my-experiment", dataset: "my-dataset", space: "my-space" });
 * console.log(result.data);
 *
 * // By name within a space, for an experiment with no dataset
 * const standalone = await listExperimentRuns({ experiment: "my-experiment", space: "my-space" });
 *
 * // With a filter
 * const filtered = await listExperimentRuns({ experiment: "my-experiment", dataset: "my-dataset", space: "my-space", filter: "eval.quality.score < 0.5" });
 *
 * // Paginating with a filter — keep the filter unchanged between pages
 * let cursor: string | undefined;
 * do {
 *   const result = await listExperimentRuns({ experiment: "your_experiment_id", filter: "output = 'approved'", cursor });
 *   console.log(result.data);
 *   cursor = result.pagination.nextCursor ?? undefined;
 * } while (cursor);
 * ```
 */
export async function listExperimentRuns({
  client: clientInstance,
  experiment,
  dataset,
  space,
  filter,
  limit = DEFAULT_LIST_LIMIT,
  cursor,
}: ListExperimentRunsParams): Promise<PaginatedResponse<ExperimentRun>> {
  warnPreRelease({ functionName: "listExperimentRuns", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const datasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;
  const experimentId = await findExperimentId(
    client,
    experiment,
    datasetId,
    spaceRef,
  );
  const response = await client.POST(
    "/v2/experiments/{experiment_id}/runs/search",
    {
      params: {
        path: { experiment_id: experimentId },
      },
      body: {
        filter,
        limit,
        cursor,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.experiment_runs.map(transformExperimentRun),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
