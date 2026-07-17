<p align="center">
  <a href="https://arize.com/ax">
    <img src="https://storage.googleapis.com/arize-assets/arize-logo-white.jpg" width="600" />
  </a>
  <br/>
  <a target="_blank" href="https://www.npmjs.com/package/@arizeai/ax-client">
    <img src="https://img.shields.io/npm/v/@arizeai/ax-client?color=blue">
  </a>
  <a target="_blank" href="https://www.npmjs.com/package/@arizeai/ax-client">
    <img src="https://img.shields.io/node/v/@arizeai/ax-client">
  </a>
  <a target="_blank" href="https://arize-ai.slack.com/join/shared_invite/zt-2w57bhem8-hq24MB6u7yE_ZF_ilOYSBw#/shared-invite/email">
    <img src="https://img.shields.io/badge/slack-@arize-blue.svg?logo=slack">
  </a>
</p>

---

# Overview

`@arizeai/ax-client` is a TypeScript client for the Arize AX REST API. It is still under active development and is subject to change.

Arize is an AI engineering platform. It helps engineers develop, evaluate, and observe AI applications and agents.

Arize has both Enterprise and OSS products to support this goal:

- [Arize AX](https://arize.com/) — an enterprise AI engineering platform from development to production, with an embedded AI Copilot
- [Phoenix](https://github.com/Arize-ai/phoenix) — a lightweight, open-source project for tracing, prompt engineering, and evaluation
- [OpenInference](https://github.com/Arize-ai/openinference) — an open-source instrumentation package to trace LLM applications across models and frameworks

# Key Features

- [**_Tracing_**](https://docs.arize.com/arize/observe/tracing) - Trace your LLM application's runtime using OpenTelemetry-based instrumentation.
- [**_Evaluation_**](https://docs.arize.com/arize/evaluate/online-evals) - Leverage LLMs to benchmark your application's performance using response and retrieval evals.
- [**_Datasets_**](https://docs.arize.com/arize/develop/datasets) - Create versioned datasets of examples for experimentation, evaluation, and fine-tuning.
- [**_Experiments_**](https://docs.arize.com/arize/develop/datasets-and-experiments) - Track and evaluate changes to prompts, LLMs, and retrieval.
- [**_Playground_**](https://docs.arize.com/arize/develop/prompt-playground)- Optimize prompts, compare models, adjust parameters, and replay traced LLM calls.
- [**_Prompt Management_**](https://docs.arize.com/arize/develop/prompt-hub)- Manage and test prompt changes systematically using version control, tagging, and experimentation.

# Table of Contents <!-- omit in toc -->

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Datasets](#datasets)
  - [Listing datasets](#listing-datasets)
  - [Creating a dataset](#creating-a-dataset)
  - [Getting a dataset](#getting-a-dataset)
  - [Updating a dataset](#updating-a-dataset)
  - [Deleting a dataset](#deleting-a-dataset)
  - [Listing dataset examples](#listing-dataset-examples)
  - [Appending dataset examples](#appending-dataset-examples)
  - [Updating dataset examples](#updating-dataset-examples)
  - [Annotating dataset examples](#annotating-dataset-examples)
- [Experiments](#experiments)
  - [Listing experiments](#listing-experiments)
  - [Creating an experiment](#creating-an-experiment)
  - [Getting an experiment](#getting-an-experiment)
  - [Deleting an experiment](#deleting-an-experiment)
  - [Listing experiment runs](#listing-experiment-runs)
  - [Appending experiment runs](#appending-experiment-runs)
  - [Annotating experiment runs](#annotating-experiment-runs)
- [Prompts](#prompts)
  - [Creating a prompt](#creating-a-prompt)
  - [Getting a prompt](#getting-a-prompt)
  - [Listing prompts](#listing-prompts)
  - [Updating a prompt](#updating-a-prompt)
  - [Deleting a prompt](#deleting-a-prompt)
  - [Prompt versions](#prompt-versions)
  - [Prompt labels](#prompt-labels)
- [Evaluators](#evaluators)
  - [Listing evaluators](#listing-evaluators)
  - [Creating a template evaluator](#creating-a-template-evaluator)
  - [Creating a code evaluator](#creating-a-code-evaluator)
  - [Getting an evaluator](#getting-an-evaluator)
  - [Updating an evaluator](#updating-an-evaluator)
  - [Deleting an evaluator](#deleting-an-evaluator)
  - [Evaluator versions](#evaluator-versions)
- [Tasks](#tasks)
  - [Listing tasks](#listing-tasks)
  - [Creating an evaluation task](#creating-an-evaluation-task)
  - [Creating a run-experiment task](#creating-a-run-experiment-task)
  - [Getting a task](#getting-a-task)
  - [Updating and deleting a task](#updating-and-deleting-a-task)
  - [Triggering and monitoring task runs](#triggering-and-monitoring-task-runs)
- [Spans](#spans)
  - [Listing spans](#listing-spans)
  - [Annotating spans](#annotating-spans)
  - [Deleting spans](#deleting-spans)
- [Annotation Configs](#annotation-configs)
  - [Listing annotation configs](#listing-annotation-configs)
  - [Creating an annotation config](#creating-an-annotation-config)
  - [Getting an annotation config](#getting-an-annotation-config)
  - [Updating an annotation config](#updating-an-annotation-config)
  - [Deleting an annotation config](#deleting-an-annotation-config)
- [Annotation Queues](#annotation-queues)
  - [Listing annotation queues](#listing-annotation-queues)
  - [Creating an annotation queue](#creating-an-annotation-queue)
  - [Getting, updating, and deleting a queue](#getting-updating-and-deleting-a-queue)
  - [Managing queue records](#managing-queue-records)
- [AI Integrations](#ai-integrations)
  - [Listing AI integrations](#listing-ai-integrations)
  - [Creating an AI integration](#creating-an-ai-integration)
  - [Getting an AI integration](#getting-an-ai-integration)
  - [Updating an AI integration](#updating-an-ai-integration)
  - [Deleting an AI integration](#deleting-an-ai-integration)
- [Projects](#projects)
  - [Creating a project](#creating-a-project)
  - [Getting a project](#getting-a-project)
  - [Listing projects](#listing-projects)
  - [Updating a project](#updating-a-project)
  - [Deleting a project](#deleting-a-project)
- [API Keys](#api-keys)
  - [Creating an API key](#creating-an-api-key)
  - [Listing API keys](#listing-api-keys)
  - [Deleting an API key](#deleting-an-api-key)
  - [Revoking an API key](#revoking-an-api-key)
  - [Refreshing an API key](#refreshing-an-api-key)
- [Roles](#roles)
  - [Creating a role](#creating-a-role)
  - [Listing roles](#listing-roles)
  - [Getting a role](#getting-a-role)
  - [Updating a role](#updating-a-role)
  - [Deleting a role](#deleting-a-role)
- [Role bindings](#role-bindings)
  - [Creating a role binding](#creating-a-role-binding)
  - [Listing role bindings](#listing-role-bindings)
  - [Getting a role binding](#getting-a-role-binding)
  - [Updating a role binding](#updating-a-role-binding)
  - [Deleting a role binding](#deleting-a-role-binding)
- [Resource restrictions](#resource-restrictions)
  - [Listing resource restrictions](#listing-resource-restrictions)
- [Organizations](#organizations)
  - [Listing organizations](#listing-organizations)
  - [Getting an organization](#getting-an-organization)
  - [Creating an organization](#creating-an-organization)
  - [Updating an organization](#updating-an-organization)
  - [Deleting an organization](#deleting-an-organization)
- [Organization memberships](#organization-memberships)
  - [Adding a user to an organization](#adding-a-user-to-an-organization)
  - [Removing a user from an organization](#removing-a-user-from-an-organization)
- [Users](#users)
  - [Listing users](#listing-users)
  - [Getting a user](#getting-a-user)
  - [Creating a user](#creating-a-user)
  - [Updating a user](#updating-a-user)
  - [Deleting a user](#deleting-a-user)
  - [Resending a user invitation](#resending-a-user-invitation)
  - [Resetting a user's password](#resetting-a-users-password)
  - [Bulk deleting users](#bulk-deleting-users)
- [Spaces](#spaces)
  - [Listing spaces](#listing-spaces)
  - [Getting a space](#getting-a-space)
  - [Creating a space](#creating-a-space)
  - [Updating a space](#updating-a-space)
  - [Deleting a space](#deleting-a-space)
- [Space memberships](#space-memberships)
  - [Adding a user to a space](#adding-a-user-to-a-space)
  - [Removing a user from a space](#removing-a-user-from-a-space)
- [REST endpoints](#rest-endpoints)

# Installation

```bash
# or yarn, pnpm, bun, etc.
npm install @arizeai/ax-client
```

# Configuration

The client will automatically read environment variables from your environment, if available.

The following environment variables are used:

- `ARIZE_API_KEY` - The API key to use for authentication.
- `ARIZE_BASE_URL` - The base URL of the Arize AX API.

Alternatively, you can pass configuration options to the client directly,
and they will be prioritized over environment variables and default values.

# Datasets

The `@arizeai/ax-client` package allows you to create and manage datasets and their examples.

## Listing datasets

```typescript
import { listDatasets } from "@arizeai/ax-client";

const datasets = await listDatasets({ space: "my-space" });
console.log(datasets);
```

## Creating a dataset

Create a dataset by providing a space (name or ID), name, and array of examples (each containing at least one property).

```typescript
import { createDataset } from "@arizeai/ax-client";

const dataset = await createDataset({
  name: "my-dataset",
  space: "my-space",
  examples: [{ question: "What is 2+2?", answer: "4", topic: "math" }],
});
```

## Getting a dataset

```typescript
import { getDataset } from "@arizeai/ax-client";

const dataset = await getDataset({ dataset: "my-dataset", space: "my-space" });
console.log(dataset);
```

## Updating a dataset

```typescript
import { updateDataset } from "@arizeai/ax-client";

const dataset = await updateDataset({
  dataset: "my-dataset",
  space: "my-space",
  name: "my-renamed-dataset",
});
```

## Deleting a dataset

```typescript
import { deleteDataset } from "@arizeai/ax-client";

await deleteDataset({ dataset: "my-dataset", space: "my-space" });
```

## Listing dataset examples

```typescript
import { listDatasetExamples } from "@arizeai/ax-client";

const examples = await listDatasetExamples({
  dataset: "my-dataset",
  space: "my-space",
});
console.log(examples);
```

## Appending dataset examples

```typescript
import { appendExamples } from "@arizeai/ax-client";

const result = await appendExamples({
  dataset: "my-dataset",
  space: "my-space",
  examples: [{ question: "What is 2+2?", answer: "4", topic: "math" }],
});
console.log(result.exampleIds); // IDs of the inserted examples
```

## Updating dataset examples

Updating examples creates a new version of the dataset.

```typescript
import { updateExamples } from "@arizeai/ax-client";

const dataset = await updateExamples({
  dataset: "my-dataset",
  space: "my-space",
  examples: [{ id: "your_example_id", question: "What is 2+2?", answer: "4" }],
  newVersionName: "your_new_version_name",
});
```

## Annotating dataset examples

```typescript
import { annotateDatasetExamples } from "@arizeai/ax-client";

await annotateDatasetExamples({
  space: "my-space",
  dataset: "my-dataset",
  annotations: [
    {
      recordId: "example_id_abc123",
      values: [
        { name: "quality", score: 0.9 },
        { name: "topic", label: "science" },
      ],
    },
  ],
});
```

## Deleting dataset examples

Examples are removed in place from the given version; no new version is created. The delete is partial-tolerant and idempotent — the result reports which IDs were deleted and which were not.

```typescript
import { deleteDatasetExamples } from "@arizeai/ax-client";

const result = await deleteDatasetExamples({
  dataset: "my-dataset",
  space: "my-space",
  datasetVersionId: "your_dataset_version_id",
  examples: ["example_id_1", "example_id_2"],
});
console.log(
  result.completed,
  result.deletedExampleIds,
  result.notDeletedExampleIds,
);
```

# Experiments

The `@arizeai/ax-client` package allows you to create and manage experiments and their runs.

## Listing experiments

```typescript
import { listExperiments } from "@arizeai/ax-client";

const experiments = await listExperiments({
  dataset: "my-dataset",
  space: "my-space",
});
console.log(experiments);
```

## Creating an experiment

```typescript
import { createExperiment } from "@arizeai/ax-client";

const experiment = await createExperiment({
  experimentName: "my-experiment",
  dataset: "my-dataset",
  space: "my-space",
  experimentRuns: [],
});
console.log(experiment);
```

## Getting an experiment

```typescript
import { getExperiment } from "@arizeai/ax-client";

// Using names
const experiment = await getExperiment({
  experiment: "my-experiment",
  dataset: "my-dataset",
  space: "my-space",
});

// Using an ID directly
const byId = await getExperiment({ experiment: "your_experiment_id" });
```

## Deleting an experiment

```typescript
import { deleteExperiment } from "@arizeai/ax-client";

await deleteExperiment({
  experiment: "my-experiment",
  dataset: "my-dataset",
  space: "my-space",
});
```

## Listing experiment runs

You can list experiment runs by providing an experiment name or ID (space and dataset context are required when using names).

```typescript
import { listExperimentRuns } from "@arizeai/ax-client";

const experimentRuns = await listExperimentRuns({
  experiment: "my-experiment",
  dataset: "my-dataset",
  space: "my-space",
});
```

## Appending experiment runs

Append between 1 and 1000 new runs to an existing experiment. Each run must include `exampleId` (the ID of an example from the experiment's dataset) and `output`. The response includes the updated experiment and the generated run IDs in input order.

```typescript
import { appendExperimentRuns } from "@arizeai/ax-client";

const result = await appendExperimentRuns({
  space: "my-space",
  dataset: "my-dataset",
  experiment: "my-experiment",
  experimentRuns: [{ exampleId: "ex_abc123", output: "The answer is 42" }],
});
console.log(result.runIds); // IDs of the appended runs
```

## Annotating experiment runs

```typescript
import { annotateExperimentRuns } from "@arizeai/ax-client";

await annotateExperimentRuns({
  space: "my-space",
  dataset: "my-dataset",
  experiment: "my-experiment",
  annotations: [
    {
      recordId: "run_id_abc123",
      values: [
        { name: "accuracy", label: "correct", score: 1.0 },
        { name: "notes", text: "Well-structured output" },
      ],
    },
  ],
});
```

# Prompts

The `@arizeai/ax-client` package allows you to create and manage prompts, their versions, and labels.

## Creating a prompt

A prompt is created together with its initial version.

```typescript
import { createPrompt } from "@arizeai/ax-client";

const prompt = await createPrompt({
  space: "my-space",
  name: "customer-support",
  description: "A prompt for customer support interactions",
  version: {
    commitMessage: "Initial version",
    inputVariableFormat: "F_STRING",
    provider: "OPEN_AI",
    model: "gpt-4",
    messages: [
      { role: "SYSTEM", content: "You are a helpful assistant." },
      { role: "USER", content: "Hello, {name}!" },
    ],
  },
});
```

## Getting a prompt

By default the latest version is returned. Pass `versionId` or `label` to resolve a specific version instead.

```typescript
import { getPrompt } from "@arizeai/ax-client";

// Latest version
const prompt = await getPrompt({
  prompt: "customer-support",
  space: "my-space",
});

// Version tagged with the "production" label
const productionPrompt = await getPrompt({
  prompt: "customer-support",
  space: "my-space",
  label: "production",
});
```

## Listing prompts

```typescript
import { listPrompts } from "@arizeai/ax-client";

const { data, pagination } = await listPrompts({ space: "my-space" });
console.log(data.map((p) => p.name));
```

## Updating a prompt

```typescript
import { updatePrompt } from "@arizeai/ax-client";

const updated = await updatePrompt({
  prompt: "customer-support",
  space: "my-space",
  description: "Updated description for the prompt",
});
```

## Deleting a prompt

```typescript
import { deletePrompt } from "@arizeai/ax-client";

await deletePrompt({ prompt: "customer-support", space: "my-space" });
```

## Prompt versions

You can list all versions of a prompt, retrieve a specific version by its ID, and create new versions.

```typescript
import {
  listPromptVersions,
  getPromptVersion,
  createPromptVersion,
} from "@arizeai/ax-client";

// List versions
const { data: versions } = await listPromptVersions({
  prompt: "customer-support",
  space: "my-space",
});

// Get a specific version by its ID (pure ID, no name resolution)
const version = await getPromptVersion({ versionId: "your-version-id" });

// Create a new version
const newVersion = await createPromptVersion({
  prompt: "customer-support",
  space: "my-space",
  commitMessage: "Updated system prompt",
  inputVariableFormat: "F_STRING",
  provider: "OPEN_AI",
  model: "gpt-4",
  messages: [
    { role: "SYSTEM", content: "You are a helpful assistant." },
    { role: "USER", content: "Hello, {name}!" },
  ],
});
```

## Prompt labels

Labels let you tag a specific prompt version with a named alias (e.g. `"production"`, `"staging"`).

```typescript
import {
  getPromptVersionByLabel,
  setPromptVersionLabels,
  deletePromptVersionLabel,
} from "@arizeai/ax-client";

// Resolve the version a label currently points to
const version = await getPromptVersionByLabel({
  prompt: "customer-support",
  space: "my-space",
  labelName: "production",
});

// Set labels on a version (replaces all existing labels)
// Returns the updated PromptVersion
const updatedVersion = await setPromptVersionLabels({
  versionId: "your-version-id",
  labels: ["production", "staging"],
});

// Remove a single label from a version
await deletePromptVersionLabel({
  versionId: "your-version-id",
  labelName: "staging",
});
```

# Evaluators

The `@arizeai/ax-client` package allows you to create and manage LLM-as-a-judge (template) and code evaluators, along with their versions.

## Listing evaluators

```typescript
import { listEvaluators } from "@arizeai/ax-client";

const evaluators = await listEvaluators({ space: "my-space" });
console.log(evaluators);
```

## Creating a template evaluator

```typescript
import { createTemplateEvaluator } from "@arizeai/ax-client";

const evaluator = await createTemplateEvaluator({
  name: "Relevance",
  space: "my-space",
  commitMessage: "Initial version",
  templateConfig: {
    name: "Relevance",
    template:
      "Is the response relevant?\nQuery: {{query}}\nResponse: {{response}}",
    includeExplanations: true,
    useFunctionCallingIfAvailable: true,
    classificationChoices: { relevant: 1, irrelevant: 0 },
    direction: "MAXIMIZE",
    llmConfig: {
      aiIntegrationId: "QUlJbnRlZ3JhdGlvbjphYmMxMjM=",
      modelName: "gpt-4o",
      invocationParameters: { temperature: 0 },
      providerParameters: {},
    },
  },
});
```

## Creating a code evaluator

```typescript
import { createCodeEvaluator } from "@arizeai/ax-client";

const evaluator = await createCodeEvaluator({
  name: "JSON Parseable",
  space: "my-space",
  commitMessage: "Initial version",
  codeConfig: {
    type: "MANAGED",
    name: "json_parseable",
    managedEvaluator: "JSON_PARSEABLE",
    variables: ["output"],
  },
});
```

## Getting an evaluator

```typescript
import { getEvaluator } from "@arizeai/ax-client";

const evaluator = await getEvaluator({
  evaluator: "Relevance",
  space: "my-space",
});
console.log(evaluator);
```

## Updating an evaluator

```typescript
import { updateEvaluator } from "@arizeai/ax-client";

const evaluator = await updateEvaluator({
  evaluator: "Relevance",
  space: "my-space",
  name: "Updated Evaluator Name",
});
```

## Deleting an evaluator

```typescript
import { deleteEvaluator } from "@arizeai/ax-client";

await deleteEvaluator({ evaluator: "Relevance", space: "my-space" });
```

## Evaluator versions

You can list all versions of an evaluator, retrieve a specific version by its ID, and create new versions.

```typescript
import {
  listEvaluatorVersions,
  getEvaluatorVersion,
  createTemplateEvaluatorVersion,
} from "@arizeai/ax-client";

// List versions
const versions = await listEvaluatorVersions({
  evaluator: "Relevance",
  space: "my-space",
});

// Get a specific version by its ID
const version = await getEvaluatorVersion({ versionId: "your-version-id" });

// Create a new template version (use createCodeEvaluatorVersion for code evaluators)
const newVersion = await createTemplateEvaluatorVersion({
  evaluator: "Relevance",
  space: "my-space",
  commitMessage: "Updated prompt template",
  templateConfig: {
    name: "Relevance",
    template: "Rate the relevance.\nQuery: {{query}}\nResponse: {{response}}",
    includeExplanations: true,
    useFunctionCallingIfAvailable: true,
    classificationChoices: { relevant: 1, irrelevant: 0 },
    direction: "MAXIMIZE",
    llmConfig: {
      aiIntegrationId: "QUlJbnRlZ3JhdGlvbjphYmMxMjM=",
      modelName: "gpt-4o",
      invocationParameters: { temperature: 0 },
      providerParameters: {},
    },
  },
});
```

# Tasks

The `@arizeai/ax-client` package allows you to create and manage scheduled or on-demand tasks (server-side evaluations and experiments) and monitor their runs.

> **Tip:** Prefer the narrowly-typed `createEvaluationTask` and `createRunExperimentTask` helpers shown below. A lower-level `createTask` is also exported if you need to construct a request payload directly.

## Listing tasks

```typescript
import { listTasks } from "@arizeai/ax-client";

const tasks = await listTasks({ space: "my-space", name: "prod" });
console.log(tasks);
```

## Creating an evaluation task

```typescript
import { createEvaluationTask } from "@arizeai/ax-client";

const task = await createEvaluationTask({
  name: "Weekly Quality Check",
  type: "TEMPLATE_EVALUATION",
  space: "my-space",
  project: "my-project",
  evaluators: [
    {
      evaluatorId: "your_evaluator_id",
      columnMappings: { input: "question", output: "answer" },
    },
  ],
});
```

## Creating a run-experiment task

```typescript
import { createRunExperimentTask } from "@arizeai/ax-client";

const task = await createRunExperimentTask({
  name: "GPT-4o Baseline Task",
  dataset: "my-dataset",
  space: "my-space",
  runConfiguration: {
    experiment_type: "LLM_GENERATION",
    aiIntegration: "my-openai-integration",
    model_name: "gpt-4o",
    input_variable_format: "F_STRING",
    messages: [
      { role: "SYSTEM", content: "You are a helpful assistant." },
      { role: "USER", content: "Answer: {question}" },
    ],
  },
});
```

## Getting a task

```typescript
import { getTask } from "@arizeai/ax-client";

// By ID
const task = await getTask({ task: "your_task_id" });

// By name (requires space)
const byName = await getTask({ task: "My Task", space: "my-space" });
```

## Updating and deleting a task

```typescript
import { updateTask, deleteTask } from "@arizeai/ax-client";

await updateTask({ task: "your_task_id", name: "Renamed Task" });
await deleteTask({ task: "your_task_id" });
```

## Triggering and monitoring task runs

```typescript
import {
  triggerTaskRun,
  waitForTaskRun,
  listTaskRuns,
  getTaskRun,
  cancelTaskRun,
} from "@arizeai/ax-client";

// Trigger a run, then poll until it finishes
const run = await triggerTaskRun({ task: "My Task", space: "my-space" });
const finalRun = await waitForTaskRun({
  runId: run.id,
  pollInterval: 3_000, // poll every 3 seconds
  timeout: 5 * 60_000, // give up after 5 minutes
});
console.log(finalRun.status); // "COMPLETED" | "FAILED" | "CANCELLED"

// List, inspect, or cancel runs
const { data: runs } = await listTaskRuns({
  task: "My Task",
  space: "my-space",
});
const single = await getTaskRun({ runId: run.id });
await cancelTaskRun({ runId: run.id });
```

# Spans

The `@arizeai/ax-client` package allows you to list, annotate, and delete spans within a project.

## Listing spans

```typescript
import { listSpans } from "@arizeai/ax-client";

// By project ID
const spans = await listSpans({ project: "your_project_id" });

// By project name (requires space)
const byName = await listSpans({ project: "My Project", space: "my-space" });
```

## Annotating spans

```typescript
import { annotateSpans } from "@arizeai/ax-client";

await annotateSpans({
  space: "my-space",
  project: "my-project",
  annotations: [
    {
      recordId: "c3Bhbl9pZF9hYmMxMjM=", // base64-encoded span ID
      values: [
        { name: "quality", score: 0.9 },
        { name: "topic", label: "science" },
      ],
    },
  ],
});
```

## Deleting spans

```typescript
import { deleteSpans } from "@arizeai/ax-client";

// By project name (requires space)
await deleteSpans({
  project: "My Project",
  space: "my-space",
  spanIds: ["a1b2c3d4e5f6a7b8", "f8e7d6c5b4a39281"],
});
```

# Annotation Configs

The `@arizeai/ax-client` package allows you to create and manage annotation configs, which define the annotations that can be applied to spans and examples.

## Listing annotation configs

```typescript
import { listAnnotationConfigs } from "@arizeai/ax-client";

const annotationConfigs = await listAnnotationConfigs({ space: "my-space" });
console.log(annotationConfigs);
```

## Creating an annotation config

Three config types are supported: continuous (a numeric score in a range), categorical (a fixed set of labeled values), and freeform (open-ended text with no scale). Use whichever type-specific function matches the config type you want.

```typescript
import {
  createContinuousAnnotationConfig,
  createCategoricalAnnotationConfig,
  createFreeformAnnotationConfig,
} from "@arizeai/ax-client";

// Continuous (numeric) annotation config
const scoreConfig = await createContinuousAnnotationConfig({
  name: "quality-score",
  space: "my-space",
  minimumScore: 0,
  maximumScore: 1,
  optimizationDirection: "MAXIMIZE",
});

// Categorical annotation config
const annotationConfig = await createCategoricalAnnotationConfig({
  name: "Accuracy",
  space: "my-space",
  values: [
    { label: "accurate", score: 1 },
    { label: "inaccurate", score: 0 },
  ],
  optimizationDirection: "MAXIMIZE",
});

// Freeform (open-ended text) annotation config
const notesConfig = await createFreeformAnnotationConfig({
  name: "reviewer-notes",
  space: "my-space",
});
```

## Getting an annotation config

```typescript
import { getAnnotationConfig } from "@arizeai/ax-client";

const annotationConfig = await getAnnotationConfig({
  annotationConfig: "Accuracy",
  space: "my-space",
});
```

## Updating an annotation config

There is a dedicated update function per annotation config type. Each one
must be called with the stored config's type — a config's type is immutable
and cannot be changed. Any fields you omit are left unchanged.

```typescript
import { updateCategoricalAnnotationConfig } from "@arizeai/ax-client";

const annotationConfig = await updateCategoricalAnnotationConfig({
  annotationConfig: "Accuracy",
  space: "my-space",
  name: "Accuracy v2",
  values: [
    { label: "accurate", score: 1 },
    { label: "inaccurate", score: 0 },
  ],
  optimizationDirection: "MAXIMIZE",
});
```

```typescript
import { updateContinuousAnnotationConfig } from "@arizeai/ax-client";

const annotationConfig = await updateContinuousAnnotationConfig({
  annotationConfig: "Accuracy",
  space: "my-space",
  name: "Accuracy v2",
  minimumScore: 0,
  maximumScore: 10,
  optimizationDirection: "MAXIMIZE",
});
```

```typescript
import { updateFreeformAnnotationConfig } from "@arizeai/ax-client";

const annotationConfig = await updateFreeformAnnotationConfig({
  annotationConfig: "Notes",
  space: "my-space",
  name: "Notes v2",
});
```

## Deleting an annotation config

```typescript
import { deleteAnnotationConfig } from "@arizeai/ax-client";

await deleteAnnotationConfig({
  annotationConfig: "Accuracy",
  space: "my-space",
});
```

# Annotation Queues

The `@arizeai/ax-client` package allows you to create and manage annotation queues, add records to them, and annotate or assign those records.

## Listing annotation queues

```typescript
import { listAnnotationQueues } from "@arizeai/ax-client";

const annotationQueues = await listAnnotationQueues({ space: "my-space" });
console.log(annotationQueues);
```

## Creating an annotation queue

```typescript
import { createAnnotationQueue } from "@arizeai/ax-client";

const queue = await createAnnotationQueue({
  name: "Quality Review Queue",
  spaceId: "your_space_id",
  annotationConfigIds: ["ac_abc123"],
  assignmentMethod: "ALL",
});
```

## Getting, updating, and deleting a queue

```typescript
import {
  getAnnotationQueue,
  updateAnnotationQueue,
  deleteAnnotationQueue,
} from "@arizeai/ax-client";

const queue = await getAnnotationQueue({
  annotationQueue: "my_queue",
  space: "my-space",
});
await updateAnnotationQueue({
  annotationQueue: "my_queue",
  space: "my-space",
  name: "Updated Queue Name",
});
await deleteAnnotationQueue({ annotationQueue: "my_queue", space: "my-space" });
```

## Managing queue records

```typescript
import {
  addAnnotationQueueRecords,
  listAnnotationQueueRecords,
  deleteAnnotationQueueRecords,
  annotateAnnotationQueueRecord,
  assignAnnotationQueueRecord,
} from "@arizeai/ax-client";

// Add records to the queue from a span source
await addAnnotationQueueRecords({
  annotationQueue: "my_queue",
  space: "my-space",
  recordSources: [
    {
      recordType: "SPAN",
      projectId: "proj_abc123",
      startTime: "2024-01-15T00:00:00Z",
      endTime: "2024-01-15T23:59:59Z",
      spanIds: ["span_abc123"],
    },
  ],
});

// List records
const records = await listAnnotationQueueRecords({
  annotationQueue: "my_queue",
  space: "my-space",
});

// Assign a record to the current user
await assignAnnotationQueueRecord({
  annotationQueue: "my_queue",
  space: "my-space",
  annotationQueueRecordId: "aqr_abc123",
});

// Submit annotations for a record
await annotateAnnotationQueueRecord({
  annotationQueue: "my_queue",
  space: "my-space",
  annotationQueueRecordId: "aqr_abc123",
  annotations: [
    { name: "accuracy", label: "correct", score: 1.0 },
    { name: "quality", text: "Well-structured response" },
  ],
});

// Remove records
await deleteAnnotationQueueRecords({
  annotationQueue: "my_queue",
  space: "my-space",
  recordIds: ["aqr_abc123", "aqr_def456"],
});
```

# AI Integrations

The `@arizeai/ax-client` package allows you to create and manage AI integrations (LLM provider credentials used by evaluators, tasks, and the playground).

## Listing AI integrations

```typescript
import { listAiIntegrations } from "@arizeai/ax-client";

const integrations = await listAiIntegrations({ space: "my-space" });
console.log(integrations);
```

## Creating an AI integration

```typescript
import { createAiIntegration } from "@arizeai/ax-client";

const integration = await createAiIntegration({
  name: "Production OpenAI",
  provider: "OPEN_AI",
  apiKey: "sk-...",
  modelNames: ["gpt-4o", "gpt-4o-mini"],
  enableDefaultModels: true,
});
```

## Getting an AI integration

```typescript
import { getAiIntegration } from "@arizeai/ax-client";

// By ID
const integration = await getAiIntegration({
  integration: "your_integration_id",
});

// By name (requires space)
const byName = await getAiIntegration({
  integration: "Production OpenAI",
  space: "my-space",
});
```

## Updating an AI integration

```typescript
import { updateAiIntegration } from "@arizeai/ax-client";

const integration = await updateAiIntegration({
  integration: "Production OpenAI",
  space: "my-space",
  name: "Updated OpenAI",
  modelNames: ["gpt-4o"],
});
```

## Deleting an AI integration

```typescript
import { deleteAiIntegration } from "@arizeai/ax-client";

await deleteAiIntegration({
  integration: "Production OpenAI",
  space: "my-space",
});
```

# Projects

The `@arizeai/ax-client` package allows you to create and manage projects.

## Creating a project

```typescript
import { createProject } from "@arizeai/ax-client";

const project = await createProject({
  space: "my-space",
  name: "my-project",
});
console.log(project);
```

## Getting a project

```typescript
import { getProject } from "@arizeai/ax-client";

const project = await getProject({
  project: "my-project",
  space: "my-space",
});
console.log(project);
```

## Listing projects

```typescript
import { listProjects } from "@arizeai/ax-client";

const { projects } = await listProjects({ space: "my-space" });
console.log(projects);
```

## Updating a project

```typescript
import { updateProject } from "@arizeai/ax-client";

const project = await updateProject({
  project: "my-project",
  space: "my-space",
  name: "my-renamed-project",
});
console.log(project);
```

## Deleting a project

```typescript
import { deleteProject } from "@arizeai/ax-client";

await deleteProject({ project: "my-project", space: "my-space" });
```

# API Keys

The `@arizeai/ax-client` package allows you to create, list, delete, revoke, and refresh API keys.

## Creating an API key

```typescript
import { createApiKey } from "@arizeai/ax-client";

const apiKey = await createApiKey({ name: "CI pipeline key" });
// Store apiKey.key securely — the full key value is only returned once
console.log(apiKey.key);
```

Service keys can be scoped to a specific space with optional role assignments:

```typescript
const apiKey = await createApiKey({
  name: "service-key",
  keyType: "SERVICE",
  spaceId: "your-space-id",
  roles: { spaceRole: "MEMBER" },
  expiresAt: new Date("2027-01-01"),
});
```

## Listing API keys

```typescript
import { listApiKeys } from "@arizeai/ax-client";

const { data } = await listApiKeys();
console.log(data.map((k) => k.name));

// Filter by key type or status
const { data: userKeys } = await listApiKeys({ keyType: "USER" });

// List service keys for a specific space
const { data: serviceKeys } = await listApiKeys({
  keyType: "SERVICE",
  spaceId: "U3BhY2U6MTIzNDU=",
});

// List service keys created by a specific user (any caller with space access)
const { data: byUser } = await listApiKeys({
  spaceId: "U3BhY2U6MTIzNDU=",
  userId: "VXNlcjoxMjM0NQ==",
});
```

## Revoking an API key

Sets the key's status to `revoked` and deactivates it immediately. This operation is irreversible; revoking an already-revoked key is a no-op and still succeeds.

```typescript
import { revokeApiKey } from "@arizeai/ax-client";

await revokeApiKey({ apiKeyId: "your-api-key-id" });
```

## Refreshing an API key

Atomically revokes an existing key and issues a replacement with the same metadata (name, description, key type). The old key is invalidated and the new key is activated in a single transaction.

```typescript
import { refreshApiKey } from "@arizeai/ax-client";

const refreshed = await refreshApiKey({ apiKeyId: "your-api-key-id" });
// Store refreshed.key securely — the full key value is only returned once
console.log(refreshed.key);
```

Supply `expiresAt` to set an expiration on the replacement key:

```typescript
const refreshed = await refreshApiKey({
  apiKeyId: "your-api-key-id",
  expiresAt: new Date("2027-01-01"),
});
```

Supply `gracePeriodSeconds` to keep the old key valid for a window after the refresh, giving your services time to adopt the new key before the old one is invalidated:

```typescript
const refreshed = await refreshApiKey({
  apiKeyId: "your-api-key-id",
  gracePeriodSeconds: 3600, // old key stays valid for 1 hour
});
// Store refreshed.key securely — the full key value is only returned once
console.log(refreshed.key);
```

# Roles

The `@arizeai/ax-client` package allows you to create and manage custom roles.

## Creating a role

```typescript
import { createRole } from "@arizeai/ax-client";

const role = await createRole({
  name: "AI Engineer",
  permissions: ["PROJECT_READ", "DATASET_READ", "DATASET_CREATE"],
  description: "Can read and create datasets and experiments.",
});
```

## Listing roles

```typescript
import { listRoles } from "@arizeai/ax-client";

const { data } = await listRoles();
console.log(data.map((r) => r.name));

// Filter to only predefined (system) roles
const { data: predefined } = await listRoles({ isPredefined: true });
```

## Getting a role

```typescript
import { getRole } from "@arizeai/ax-client";

const role = await getRole({ roleId: "your-role-id" });
```

## Updating a role

```typescript
import { updateRole } from "@arizeai/ax-client";

const role = await updateRole({
  roleId: "your-role-id",
  permissions: ["PROJECT_READ", "DATASET_READ"],
});
```

## Deleting a role

```typescript
import { deleteRole } from "@arizeai/ax-client";

await deleteRole({ roleId: "your-role-id" });
```

# Role bindings

The `@arizeai/ax-client` package allows you to bind a role to a user on a specific resource (e.g. a project or space).

## Creating a role binding

```typescript
import { createRoleBinding } from "@arizeai/ax-client";

const binding = await createRoleBinding({
  userId: "VXNlcjoxMjM0NQ==",
  roleId: "Um9sZTphYmMxMjM=",
  resourceType: "PROJECT",
  resourceId: "UHJvamVjdDphYmMxMjM=",
});
console.log(binding);
```

## Listing role bindings

```typescript
import { listRoleBindings } from "@arizeai/ax-client";

const bindings = await listRoleBindings({ resourceType: "SPACE" });
console.log(bindings);
```

## Getting a role binding

```typescript
import { getRoleBinding } from "@arizeai/ax-client";

const binding = await getRoleBinding({ bindingId: "Um9sZUJpbmRpbmc6YWJjMTIz" });
```

## Updating a role binding

```typescript
import { updateRoleBinding } from "@arizeai/ax-client";

const binding = await updateRoleBinding({
  bindingId: "Um9sZUJpbmRpbmc6YWJjMTIz",
  roleId: "Um9sZTphYmMxMjM=",
});
```

## Deleting a role binding

```typescript
import { deleteRoleBinding } from "@arizeai/ax-client";

await deleteRoleBinding({ bindingId: "Um9sZUJpbmRpbmc6YWJjMTIz" });
```

# Resource restrictions

The `@arizeai/ax-client` package allows you to restrict access to a resource so that only explicitly bound users can access it, and to lift that restriction.

```typescript
import { restrictResource, unrestrictResource } from "@arizeai/ax-client";

// Restrict a resource
const restriction = await restrictResource({ resourceId: "your_project_id" });
console.log(restriction);

// Lift the restriction
await unrestrictResource({ resourceId: "your_project_id" });
```

## Listing resource restrictions

List the active resource restrictions the authenticated user is permitted to manage.

```typescript
import { listResourceRestrictions } from "@arizeai/ax-client";

const { data } = await listResourceRestrictions();
console.log(data.map((r) => r.resourceId));

// Filter to a single resource type
const { data: projects } = await listResourceRestrictions({
  resourceType: "PROJECT",
});
```

# Organizations

The `@arizeai/ax-client` package allows you to manage organizations.

## Listing organizations

```typescript
import { listOrganizations } from "@arizeai/ax-client";

const result = await listOrganizations();
console.log(result.organizations);
```

## Getting an organization

```typescript
import { getOrganization } from "@arizeai/ax-client";

const org = await getOrganization({ organization: "your-organization-name" });
console.log(org);
```

## Creating an organization

```typescript
import { createOrganization } from "@arizeai/ax-client";

const org = await createOrganization({
  name: "your-organization-name",
  description: "Optional description",
});
console.log(org);
```

## Updating an organization

```typescript
import { updateOrganization } from "@arizeai/ax-client";

const org = await updateOrganization({
  organization: "your-organization-name",
  name: "your-organization-name-updated",
});
console.log(org);
```

## Deleting an organization

> **Warning:** This operation is irreversible and deletes the organization
> and all resources that belong to it, including all spaces and their contents.

```typescript
import { deleteOrganization } from "@arizeai/ax-client";

await deleteOrganization({ organization: "your-organization-name" });
```

# Organization memberships

## Adding a user to an organization

```typescript
import { addOrganizationUser } from "@arizeai/ax-client";

const membership = await addOrganizationUser({
  organizationId: "org_abc123",
  userId: "VXNlcjoxMjM0NQ==",
  role: { type: "PREDEFINED", name: "MEMBER" },
});
console.log(membership);
```

## Removing a user from an organization

```typescript
import { removeOrganizationUser } from "@arizeai/ax-client";

await removeOrganizationUser({
  organizationId: "org_abc123",
  userId: "VXNlcjoxMjM0NQ==",
});
```

# Users

The `@arizeai/ax-client` package allows you to manage users.

> **Note:** Unlike organizations, users are identified by opaque ID only — not
> by name. User display names are not unique within an account, so all functions
> require the user's ID.

## Listing users

```typescript
import { listUsers } from "@arizeai/ax-client";

const result = await listUsers();
console.log(result.data);
```

## Getting a user

```typescript
import { getUser } from "@arizeai/ax-client";

const user = await getUser({ userId: "VXNlcjoxMjM0NQ==" });
console.log(user);
```

## Creating a user

The `inviteMode` parameter controls how the user is invited:

- `"EMAIL_LINK"` — sends the user an email with a verification link.
- `"TEMPORARY_PASSWORD"` — issues a one-time password returned in the response.
- `"NONE"` — pre-provisions an SSO user directly; no invitation is sent and the
  user is immediately active via the configured identity provider.

Returns a `UserCreated` object (HTTP 201) for a new user, or a `User` object
(HTTP 200) when an existing `invited` user is returned as-is (idempotent — the
invitation is not resent).

```typescript
import { createUser } from "@arizeai/ax-client";

const user = await createUser({
  name: "Jane Smith",
  email: "jane.smith@example.com",
  role: { type: "PREDEFINED", name: "MEMBER" },
  inviteMode: "EMAIL_LINK",
});
console.log(user);
```

## Updating a user

```typescript
import { updateUser } from "@arizeai/ax-client";

const user = await updateUser({
  userId: "VXNlcjoxMjM0NQ==",
  name: "Jane Smith Updated",
  isDeveloper: true,
});
console.log(user);
```

## Deleting a user

> **Warning:** This operation permanently blocks the user from the account.
> Blocked users cannot be re-invited — inactive is a terminal state. The
> operation cascades to organization memberships, space memberships, API keys,
> and role bindings.

```typescript
import { deleteUser } from "@arizeai/ax-client";

await deleteUser({ userId: "VXNlcjoxMjM0NQ==" });
```

## Resending a user invitation

```typescript
import { resendInvitation } from "@arizeai/ax-client";

await resendInvitation({ userId: "VXNlcjoxMjM0NQ==" });
```

## Resetting a user's password

```typescript
import { resetPassword } from "@arizeai/ax-client";

await resetPassword({ userId: "VXNlcjoxMjM0NQ==" });
```

## Bulk deleting users

Delete multiple users by ID and/or email. Each entry's outcome is returned individually.

```typescript
import { bulkDeleteUsers } from "@arizeai/ax-client";

const results = await bulkDeleteUsers({
  userIds: ["VXNlcjoxMjM0NQ=="],
  emails: ["jane.smith@example.com"],
});
for (const r of results) {
  console.log(r.userId, r.status, r.error ?? "");
}
```

# Spaces

The `@arizeai/ax-client` package allows you to create and manage spaces.

## Listing spaces

```typescript
import { listSpaces } from "@arizeai/ax-client";

const spaces = await listSpaces();
console.log(spaces);
```

## Getting a space

```typescript
import { getSpace } from "@arizeai/ax-client";

const space = await getSpace({ space: "my-space" });
console.log(space);
```

## Creating a space

```typescript
import { createSpace } from "@arizeai/ax-client";

const space = await createSpace({
  organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
  name: "your_space_name",
});
```

## Updating a space

```typescript
import { updateSpace } from "@arizeai/ax-client";

const space = await updateSpace({
  space: "my-space",
  name: "updated_space_name",
});
```

## Deleting a space

```typescript
import { deleteSpace } from "@arizeai/ax-client";

await deleteSpace({ space: "my-space" });
```

# Space memberships

## Adding a user to a space

```typescript
import { addSpaceUser } from "@arizeai/ax-client";

const membership = await addSpaceUser({
  spaceId: "spc_abc123",
  userId: "VXNlcjoxMjM0NQ==",
  role: { type: "PREDEFINED", name: "MEMBER" },
});
console.log(membership);
```

## Removing a user from a space

```typescript
import { removeSpaceUser } from "@arizeai/ax-client";

await removeSpaceUser({
  spaceId: "spc_abc123",
  userId: "VXNlcjoxMjM0NQ==",
});
```

# REST endpoints

It is recommended to use the methods in this package. If more control is desired, you can use the client directly. The client provides a type-safe fetch for the entire Arize AX REST API.

```typescript
import { createClient } from "@arizeai/ax-client";

const client = createClient();

// Get all datasets
const response = await client.GET("/v2/datasets");
```
