import type { createClient } from "../client";
import { handleApiError, ResolutionError } from "../errors";

/**
 * The type of the client object.
 */
type Client = ReturnType<typeof createClient>;

/**
 * A space reference that can be either an ID or a name.
 * Resolve functions accept this so callers never need to pre-resolve the space.
 */
export interface SpaceRef {
  spaceId?: string;
  spaceName?: string;
}

/**
 * Detect whether a value is a base64-encoded resource ID.
 * Base64 IDs decode to a string containing a colon, e.g. `"Model:123"`.
 */
export function isBase64Id(value: string): boolean {
  try {
    const decoded = atob(value);
    return decoded.includes(":");
  } catch {
    return false;
  }
}

/** Check whether a value looks like a resource ID (base64 ID). */
export function isResourceId(value: string): boolean {
  return isBase64Id(value);
}

/**
 * Convert a raw space string (name or ID) into a {@link SpaceRef}.
 * This is a **synchronous** helper — no API call is made.
 */
export function toSpaceRef(space: string | undefined): SpaceRef {
  if (space == null) {
    return {};
  }
  if (isResourceId(space)) {
    return { spaceId: space };
  }
  return { spaceName: space };
}

/** Throw if a SpaceRef has neither an ID nor a name. */
function requireSpace(
  resourceType: string,
  resourceName: string,
  ref: SpaceRef,
): void {
  if (!ref.spaceId && !ref.spaceName) {
    throw new ResolutionError(
      resourceType,
      resourceName,
      [],
      "Provide 'space' so the " + resourceType + " name can be resolved.",
    );
  }
}

/**
 * Find a space ID from a space ID or name.
 *
 * If the value is already a base64-encoded resource ID,
 * it is returned as-is. Otherwise, the list spaces endpoint is called to find
 * an exact name match.
 */
export async function findSpaceId(
  client: Client,
  space: string,
): Promise<string> {
  if (isResourceId(space)) {
    return space;
  }

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/spaces", {
      params: { query: { name: space, limit: 100, cursor } },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const s of response.data.spaces) {
      if (s.name === space) {
        return s.id;
      }
      available.push(s.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("space", space, available);
}

/**
 * Resolve a project ID or name to a project ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list projects endpoint is called with whichever of
 * `space_id` / `space_name` is available.
 */
export async function findProjectId(
  client: Client,
  project: string,
  space?: SpaceRef | string,
): Promise<string> {
  if (isResourceId(project)) {
    return project;
  }

  const ref = typeof space === "string" ? toSpaceRef(space) : (space ?? {});
  requireSpace("project", project, ref);

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/projects", {
      params: {
        query: {
          space_id: ref.spaceId,
          space_name: ref.spaceName,
          name: project,
          limit: 100,
          cursor,
        },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const p of response.data.projects) {
      if (p.name === project) {
        return p.id;
      }
      available.push(p.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("project", project, available);
}

/**
 * Resolve a dataset ID or name to a dataset ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list datasets endpoint is called with whichever of
 * `space_id` / `space_name` is available.
 */
export async function findDatasetId(
  client: Client,
  dataset: string,
  space?: SpaceRef | string,
): Promise<string> {
  if (isResourceId(dataset)) {
    return dataset;
  }

  const ref = typeof space === "string" ? toSpaceRef(space) : (space ?? {});
  requireSpace("dataset", dataset, ref);

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/datasets", {
      params: {
        query: {
          space_id: ref.spaceId,
          space_name: ref.spaceName,
          name: dataset,
          limit: 100,
          cursor,
        },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const d of response.data.datasets) {
      if (d.name === dataset) {
        return d.id;
      }
      available.push(d.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("dataset", dataset, available);
}

/**
 * Resolve an experiment ID or name to an experiment ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, requires `datasetId` to search by name.
 */
export async function findExperimentId(
  client: Client,
  experiment: string,
  datasetId?: string,
): Promise<string> {
  if (isResourceId(experiment)) {
    return experiment;
  }

  if (!datasetId) {
    throw new ResolutionError(
      "experiment",
      experiment,
      [],
      "Provide 'dataset' so the experiment name can be resolved.",
    );
  }

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/experiments", {
      params: {
        query: { dataset_id: datasetId, name: experiment, limit: 100, cursor },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const e of response.data.experiments) {
      if (e.name === experiment) {
        return e.id;
      }
      available.push(e.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("experiment", experiment, available);
}

/**
 * Resolve a prompt ID or name to a prompt ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list prompts endpoint is called with whichever of
 * `space_id` / `space_name` is available.
 */
export async function findPromptId(
  client: Client,
  prompt: string,
  space?: SpaceRef | string,
): Promise<string> {
  if (isResourceId(prompt)) {
    return prompt;
  }

  const ref = typeof space === "string" ? toSpaceRef(space) : (space ?? {});
  requireSpace("prompt", prompt, ref);

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/prompts", {
      params: {
        query: {
          space_id: ref.spaceId,
          space_name: ref.spaceName,
          name: prompt,
          limit: 100,
          cursor,
        },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const p of response.data.prompts) {
      if (p.name === prompt) {
        return p.id;
      }
      available.push(p.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("prompt", prompt, available);
}

/**
 * Resolve an evaluator ID or name to an evaluator ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list evaluators endpoint is called with whichever of
 * `space_id` / `space_name` is available.
 */
export async function findEvaluatorId(
  client: Client,
  evaluator: string,
  space?: SpaceRef | string,
): Promise<string> {
  if (isResourceId(evaluator)) {
    return evaluator;
  }

  const ref = typeof space === "string" ? toSpaceRef(space) : (space ?? {});
  requireSpace("evaluator", evaluator, ref);

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/evaluators", {
      params: {
        query: {
          space_id: ref.spaceId,
          space_name: ref.spaceName,
          name: evaluator,
          limit: 100,
          cursor,
        },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const ev of response.data.evaluators) {
      if (ev.name === evaluator) {
        return ev.id;
      }
      available.push(ev.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("evaluator", evaluator, available);
}

/**
 * Resolve an annotation config ID or name to an annotation config ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list annotation-configs endpoint is called with whichever of
 * `space_id` / `space_name` is available.
 */
export async function findAnnotationConfigId(
  client: Client,
  annotationConfig: string,
  space?: SpaceRef | string,
): Promise<string> {
  if (isResourceId(annotationConfig)) {
    return annotationConfig;
  }

  const ref = typeof space === "string" ? toSpaceRef(space) : (space ?? {});
  requireSpace("annotation config", annotationConfig, ref);

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/annotation-configs", {
      params: {
        query: {
          space_id: ref.spaceId,
          space_name: ref.spaceName,
          name: annotationConfig,
          limit: 100,
          cursor,
        },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const ac of response.data.annotation_configs) {
      if (ac.name === annotationConfig) {
        return ac.id;
      }
      available.push(ac.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("annotation config", annotationConfig, available);
}

/**
 * Resolve an AI integration ID or name to an AI integration ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list AI integrations endpoint is called with whichever of
 * `space_id` / `space_name` is available.
 */
export async function findAiIntegrationId(
  client: Client,
  integration: string,
  space?: SpaceRef | string,
): Promise<string> {
  if (isResourceId(integration)) {
    return integration;
  }

  const ref = typeof space === "string" ? toSpaceRef(space) : (space ?? {});
  requireSpace("AI integration", integration, ref);

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/ai-integrations", {
      params: {
        query: {
          space_id: ref.spaceId,
          space_name: ref.spaceName,
          name: integration,
          limit: 100,
          cursor,
        },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const ai of response.data.ai_integrations) {
      if (ai.name === integration) {
        return ai.id;
      }
      available.push(ai.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("AI integration", integration, available);
}

/**
 * Resolve an annotation queue ID or name to an annotation queue ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list annotation-queues endpoint is called with whichever of
 * `space_id` / `space_name` is available.
 */
export async function findAnnotationQueueId(
  client: Client,
  annotationQueue: string,
  space?: SpaceRef | string,
): Promise<string> {
  if (isResourceId(annotationQueue)) {
    return annotationQueue;
  }

  const ref = typeof space === "string" ? toSpaceRef(space) : (space ?? {});
  requireSpace("annotation queue", annotationQueue, ref);

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/annotation-queues", {
      params: {
        query: {
          space_id: ref.spaceId,
          space_name: ref.spaceName,
          name: annotationQueue,
          limit: 100,
          cursor,
        },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const q of response.data.annotation_queues) {
      if (q.name === annotationQueue) {
        return q.id;
      }
      available.push(q.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("annotation queue", annotationQueue, available);
}

/**
 * Resolve a task ID or name to a task ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list tasks endpoint is called with whichever of
 * `space_id` / `space_name` is available.
 */
export async function findTaskId(
  client: Client,
  task: string,
  space?: SpaceRef | string,
): Promise<string> {
  if (isResourceId(task)) {
    return task;
  }

  const ref = typeof space === "string" ? toSpaceRef(space) : (space ?? {});
  requireSpace("task", task, ref);

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/tasks", {
      params: {
        query: {
          space_id: ref.spaceId,
          space_name: ref.spaceName,
          name: task,
          limit: 100,
          cursor,
        },
      },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const t of response.data.tasks) {
      if (t.name === task) {
        return t.id;
      }
      available.push(t.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("task", task, available);
}

/**
 * Resolve an organization ID or name to an organization ID.
 *
 * If the value is a base64 ID, it is returned as-is.
 * Otherwise, the list organizations endpoint is called to find an exact name match.
 */
export async function findOrganizationId(
  client: Client,
  organization: string,
): Promise<string> {
  if (isResourceId(organization)) {
    return organization;
  }

  const available: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.GET("/v2/organizations", {
      params: { query: { name: organization, limit: 100, cursor } },
    });
    if (response.error) {
      return handleApiError(response);
    }
    for (const o of response.data.organizations) {
      if (o.name === organization) {
        return o.id;
      }
      available.push(o.name);
    }
    cursor = response.data.pagination.next_cursor ?? undefined;
  } while (cursor);

  throw new ResolutionError("organization", organization, available);
}
