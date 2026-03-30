/**
 * Integration tests for resolve utilities.
 *
 * These tests hit the real Arize API and require:
 *   - ARIZE_API_KEY env var
 *   - ARIZE_TEST_SPACE_NAME env var — human-readable space name, or
 *     base64-encoded GraphQL space ID
 *
 * Run with:
 *   ARIZE_API_KEY=... ARIZE_TEST_SPACE_NAME=... pnpm vitest run src/utils/__tests__/resolve.integration.test.ts
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "../../client";
import {
  findSpaceId,
  findProjectId,
  findDatasetId,
  findPromptId,
  findEvaluatorId,
  findAnnotationConfigId,
  findAiIntegrationId,
  findTaskId,
  findExperimentId,
  isBase64Id,
} from "../resolve";
import { ResolutionError } from "../../errors";

const apiKey = process.env.ARIZE_API_KEY;
const spaceName = process.env.ARIZE_TEST_SPACE_NAME;

const shouldRun = Boolean(apiKey && spaceName);

describe.skipIf(!shouldRun)("resolve utilities (integration)", () => {
  const client = shouldRun ? createClient({ apiKey }) : (null as never);
  let spaceId: string;

  beforeAll(async () => {
    spaceId = await findSpaceId(client, spaceName!);
  });

  // ── Space ──────────────────────────────────────────────────────────

  describe("findSpaceId", () => {
    it("resolves a space name to a space ID", () => {
      expect(isBase64Id(spaceId)).toBe(true);
    });

    it("returns a space ID as-is", async () => {
      const result = await findSpaceId(client, spaceId);
      expect(result).toBe(spaceId);
    });

    it("throws ResolutionError for a non-existent space", async () => {
      await expect(
        findSpaceId(client, "___nonexistent_space_abc123___"),
      ).rejects.toThrow(ResolutionError);
    });
  });

  // ── Project ────────────────────────────────────────────────────────

  describe("findProjectId", () => {
    let projectName: string | undefined;
    let projectId: string | undefined;

    beforeAll(async () => {
      const response = await client.GET("/v2/projects", {
        params: { query: { space_id: spaceId, limit: 1 } },
      });
      const project = response.data?.projects[0];
      projectName = project?.name;
      projectId = project?.id;
    });

    it("resolves a project name to a base64 ID", async () => {
      if (!projectName) return; // skip if space has no projects
      const result = await findProjectId(client, projectName, spaceId);
      expect(isBase64Id(result)).toBe(true);
      expect(result).toBe(projectId);
    });

    it("returns a project ID as-is", async () => {
      if (!projectId) return;
      const result = await findProjectId(client, projectId);
      expect(result).toBe(projectId);
    });

    it("throws ResolutionError without space when using a name", async () => {
      if (!projectName) return;
      await expect(findProjectId(client, projectName)).rejects.toThrow(
        ResolutionError,
      );
    });

    it("throws ResolutionError for a non-existent project", async () => {
      await expect(
        findProjectId(client, "___nonexistent_project___", spaceId),
      ).rejects.toThrow(ResolutionError);
    });
  });

  // ── Dataset ────────────────────────────────────────────────────────

  describe("findDatasetId", () => {
    let datasetName: string | undefined;
    let datasetId: string | undefined;

    beforeAll(async () => {
      const response = await client.GET("/v2/datasets", {
        params: { query: { space_id: spaceId, limit: 1 } },
      });
      const dataset = response.data?.datasets[0];
      datasetName = dataset?.name;
      datasetId = dataset?.id;
    });

    it("resolves a dataset name to a base64 ID", async () => {
      if (!datasetName) return;
      const result = await findDatasetId(client, datasetName, spaceId);
      expect(isBase64Id(result)).toBe(true);
      expect(result).toBe(datasetId);
    });

    it("returns a dataset ID as-is", async () => {
      if (!datasetId) return;
      const result = await findDatasetId(client, datasetId);
      expect(result).toBe(datasetId);
    });

    it("throws ResolutionError without space when using a name", async () => {
      if (!datasetName) return;
      await expect(findDatasetId(client, datasetName)).rejects.toThrow(
        ResolutionError,
      );
    });
  });

  // ── Experiment ─────────────────────────────────────────────────────

  describe("findExperimentId", () => {
    let experimentName: string | undefined;
    let experimentId: string | undefined;
    let datasetId: string | undefined;

    beforeAll(async () => {
      // Find a dataset that has experiments
      const dsResponse = await client.GET("/v2/datasets", {
        params: { query: { space_id: spaceId, limit: 10 } },
      });
      for (const ds of dsResponse.data?.datasets ?? []) {
        const expResponse = await client.GET("/v2/experiments", {
          params: { query: { dataset_id: ds.id, limit: 1 } },
        });
        const experiment = expResponse.data?.experiments[0];
        if (experiment) {
          experimentName = experiment.name;
          experimentId = experiment.id;
          datasetId = ds.id;
          break;
        }
      }
    });

    it("resolves an experiment name to a base64 ID", async () => {
      if (!experimentName || !datasetId) return;
      const result = await findExperimentId(client, experimentName, datasetId);
      expect(isBase64Id(result)).toBe(true);
      expect(result).toBe(experimentId);
    });

    it("returns an experiment ID as-is", async () => {
      if (!experimentId) return;
      const result = await findExperimentId(client, experimentId);
      expect(result).toBe(experimentId);
    });

    it("throws ResolutionError without dataset when using a name", async () => {
      if (!experimentName) return;
      await expect(findExperimentId(client, experimentName)).rejects.toThrow(
        ResolutionError,
      );
    });
  });

  // ── Prompt ─────────────────────────────────────────────────────────

  describe("findPromptId", () => {
    let promptName: string | undefined;
    let promptId: string | undefined;

    beforeAll(async () => {
      const response = await client.GET("/v2/prompts", {
        params: { query: { space_id: spaceId, limit: 1 } },
      });
      const prompt = response.data?.prompts[0];
      promptName = prompt?.name;
      promptId = prompt?.id;
    });

    it("resolves a prompt name to a base64 ID", async () => {
      if (!promptName) return;
      const result = await findPromptId(client, promptName, spaceId);
      expect(isBase64Id(result)).toBe(true);
      expect(result).toBe(promptId);
    });

    it("returns a prompt ID as-is", async () => {
      if (!promptId) return;
      const result = await findPromptId(client, promptId);
      expect(result).toBe(promptId);
    });

    it("throws ResolutionError without space when using a name", async () => {
      if (!promptName) return;
      await expect(findPromptId(client, promptName)).rejects.toThrow(
        ResolutionError,
      );
    });
  });

  // ── Evaluator ──────────────────────────────────────────────────────

  describe("findEvaluatorId", () => {
    let evaluatorName: string | undefined;
    let evaluatorId: string | undefined;

    beforeAll(async () => {
      const response = await client.GET("/v2/evaluators", {
        params: { query: { space_id: spaceId, limit: 1 } },
      });
      const evaluator = response.data?.evaluators[0];
      evaluatorName = evaluator?.name;
      evaluatorId = evaluator?.id;
    });

    it("resolves an evaluator name to a base64 ID", async () => {
      if (!evaluatorName) return;
      const result = await findEvaluatorId(client, evaluatorName, spaceId);
      expect(isBase64Id(result)).toBe(true);
      expect(result).toBe(evaluatorId);
    });

    it("returns an evaluator ID as-is", async () => {
      if (!evaluatorId) return;
      const result = await findEvaluatorId(client, evaluatorId);
      expect(result).toBe(evaluatorId);
    });

    it("throws ResolutionError without space when using a name", async () => {
      if (!evaluatorName) return;
      await expect(findEvaluatorId(client, evaluatorName)).rejects.toThrow(
        ResolutionError,
      );
    });
  });

  // ── Annotation Config ──────────────────────────────────────────────

  describe("findAnnotationConfigId", () => {
    let configName: string | undefined;
    let configId: string | undefined;

    beforeAll(async () => {
      const response = await client.GET("/v2/annotation-configs", {
        params: { query: { space_id: spaceId, limit: 1 } },
      });
      const config = response.data?.annotation_configs[0];
      configName = config?.name;
      configId = config?.id;
    });

    it("resolves an annotation config name to a base64 ID", async () => {
      if (!configName) return;
      const result = await findAnnotationConfigId(client, configName, spaceId);
      expect(isBase64Id(result)).toBe(true);
      expect(result).toBe(configId);
    });

    it("returns an annotation config ID as-is", async () => {
      if (!configId) return;
      const result = await findAnnotationConfigId(client, configId);
      expect(result).toBe(configId);
    });

    it("throws ResolutionError without space when using a name", async () => {
      if (!configName) return;
      await expect(findAnnotationConfigId(client, configName)).rejects.toThrow(
        ResolutionError,
      );
    });
  });

  // ── AI Integration ─────────────────────────────────────────────────

  describe("findAiIntegrationId", () => {
    let integrationName: string | undefined;
    let integrationId: string | undefined;

    beforeAll(async () => {
      const response = await client.GET("/v2/ai-integrations", {
        params: { query: { space_id: spaceId, limit: 1 } },
      });
      const integration = response.data?.ai_integrations[0];
      integrationName = integration?.name;
      integrationId = integration?.id;
    });

    it("resolves an AI integration name to a base64 ID", async () => {
      if (!integrationName) return;
      const result = await findAiIntegrationId(
        client,
        integrationName,
        spaceId,
      );
      expect(isBase64Id(result)).toBe(true);
      expect(result).toBe(integrationId);
    });

    it("returns an AI integration ID as-is", async () => {
      if (!integrationId) return;
      const result = await findAiIntegrationId(client, integrationId);
      expect(result).toBe(integrationId);
    });

    it("throws ResolutionError without space when using a name", async () => {
      if (!integrationName) return;
      await expect(
        findAiIntegrationId(client, integrationName),
      ).rejects.toThrow(ResolutionError);
    });
  });

  // ── Task ───────────────────────────────────────────────────────────

  describe("findTaskId", () => {
    let taskName: string | undefined;
    let taskId: string | undefined;

    beforeAll(async () => {
      const response = await client.GET("/v2/tasks", {
        params: { query: { space_id: spaceId, limit: 1 } },
      });
      const task = response.data?.tasks[0];
      taskName = task?.name;
      taskId = task?.id;
    });

    it("resolves a task name to a base64 ID", async () => {
      if (!taskName) return;
      const result = await findTaskId(client, taskName, spaceId);
      expect(isBase64Id(result)).toBe(true);
      expect(result).toBe(taskId);
    });

    it("returns a task ID as-is", async () => {
      if (!taskId) return;
      const result = await findTaskId(client, taskId);
      expect(result).toBe(taskId);
    });

    it("throws ResolutionError without space when using a name", async () => {
      if (!taskName) return;
      await expect(findTaskId(client, taskName)).rejects.toThrow(
        ResolutionError,
      );
    });
  });
});
