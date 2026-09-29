/**
 * Integration tests for listExperimentRuns.
 *
 * These tests hit the real Arize API and require:
 *   - ARIZE_API_KEY env var
 *   - ARIZE_TEST_SPACE_NAME env var — human-readable space name, or
 *     base64-encoded GraphQL space ID
 *
 * The whole file is skipped unless both ARIZE_API_KEY and
 * ARIZE_TEST_SPACE_NAME are set, so `pnpm test` never runs it by accident.
 * Run it on its own with:
 *   ARIZE_API_KEY=... ARIZE_TEST_SPACE_NAME=... pnpm vitest run src/experiments/__tests__/listExperimentRuns.integration.test.ts
 *
 * Every resource created here is named `ts-sdk-itest-<timestamp>-…` and
 * deleted in afterAll whether or not the tests pass.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createClient } from "../../client";
import {
  createDataset,
  deleteDataset,
  listDatasetExamples,
} from "../../datasets";
import { createExperiment, deleteExperiment, listExperimentRuns } from "..";
import { NotFoundError } from "../../errors";
import { findSpaceId } from "../../utils/resolve";
import type { Dataset, Experiment } from "../../types";

const apiKey = process.env.ARIZE_API_KEY;
const spaceName = process.env.ARIZE_TEST_SPACE_NAME;

const shouldRun = Boolean(apiKey && spaceName);

vi.setConfig({ testTimeout: 30_000, hookTimeout: 120_000 });

const prefix = `ts-sdk-itest-${Date.now()}`;
const datasetName = `${prefix}-dataset`;
const experimentName = `${prefix}-experiment`;
const outputAlpha = `${prefix}-output-alpha`;
const outputBeta = `${prefix}-output-beta`;

describe.skipIf(!shouldRun)("listExperimentRuns (integration)", () => {
  const client = shouldRun ? createClient({ apiKey }) : (null as never);

  let dataset: Dataset;
  let experiment: Experiment;

  beforeAll(async () => {
    const spaceId = await findSpaceId(client, spaceName!);
    dataset = await createDataset({
      client,
      space: spaceId,
      name: datasetName,
      examples: [
        { question: "What is 2+2?", answer: "4" },
        { question: "What is 3+3?", answer: "6" },
      ],
    });
    const examples = await listDatasetExamples({ client, dataset: dataset.id });
    const exampleIds = examples.data.map((example) => example.id);
    if (exampleIds.length < 2) {
      throw new Error("Failed to create the dataset examples for the test.");
    }
    experiment = await createExperiment({
      client,
      experimentName,
      dataset: dataset.id,
      experimentRuns: [
        { exampleId: exampleIds[0]!, output: outputAlpha },
        { exampleId: exampleIds[1]!, output: outputBeta },
      ],
    });
  });

  afterAll(async () => {
    const failures: string[] = [];
    if (experiment) {
      try {
        await deleteExperiment({ client, experiment: experiment.id });
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          failures.push(String(error));
        }
      }
    }
    if (dataset) {
      try {
        await deleteDataset({ client, dataset: dataset.id });
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          failures.push(String(error));
        }
      }
    }
    if (failures.length > 0) {
      throw new Error(`Cleanup failed:\n${failures.join("\n")}`);
    }
  });

  it("returns all runs when no filter is provided", async () => {
    const result = await listExperimentRuns({
      client,
      experiment: experiment.id,
    });

    expect(result.data).toHaveLength(2);
    const outputs = result.data.map((run) => run.output);
    expect(outputs).toEqual(expect.arrayContaining([outputAlpha, outputBeta]));
  });

  it("narrows to exactly one run with a filter", async () => {
    const result = await listExperimentRuns({
      client,
      experiment: experiment.id,
      filter: `output = '${outputAlpha}'`,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]!.output).toBe(outputAlpha);
  });

  it("paginates with limit 1 and the returned cursor", async () => {
    const first = await listExperimentRuns({
      client,
      experiment: experiment.id,
      limit: 1,
    });

    expect(first.data).toHaveLength(1);
    expect(first.pagination.hasMore).toBe(true);
    expect(first.pagination.nextCursor).toEqual(expect.any(String));

    const second = await listExperimentRuns({
      client,
      experiment: experiment.id,
      limit: 1,
      cursor: first.pagination.nextCursor,
    });

    expect(second.data).toHaveLength(1);
    expect(second.pagination.hasMore).toBe(false);
    const ids = [first.data[0]!.id, second.data[0]!.id];
    expect(new Set(ids).size).toBe(2);
  });
});
