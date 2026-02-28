# Arize AX TS Client

This package provides a TypeScript client for the Arize AX REST API. It is still under active development and is subject to change.

## Installation

```bash
# or yarn, pnpm, bun, etc.
npm install @arizeai/ax-client
```

## Configuration

The client will automatically read environment variables from your environment, if available.

The following environment variables are used:

- `ARIZE_API_KEY` - The API key to use for authentication.
- `ARIZE_BASE_URL` - The base URL of the Arize AX API.

Alternatively, you can pass configuration options to the client directly, and they will be prioritized over environment variables and default values.

## Datasets

The `@arizeai/ax-client` package allows you to create and manage datasets.

### Creating a dataset

Create a dataset by providing a spaceId, name, and array of examples (each containing at least one property). There are a few examples below, check out our docs for full documentation.

```typescript
import { createDataset } from "@arizeai/ax-client";

const dataset = await createDataset({
  name: "my-dataset",
  spaceId: "space-id",
  examples: [
    {
      question: "What is 2 + 2?",
      answer: 4,
      topic: "math",
    },
  ],
});
```

## Experiments

The `@arizeai/ax-client` package allows you to create and manage experiments.

### Listing experiment runs

You can list experiment runs by providing an experimentId and an optional limit of experiment runs to return. There are a few examples below, check out our docs for full documentation.

```typescript
import { listExperimentRuns } from "@arizeai/ax-client";

const experimentRuns = await listExperimentRuns({
  experimentId: "experiment-id",
});
```

## Prompts

The `@arizeai/ax-client` package allows you to create and manage prompts.

### Managing prompts

You can list, create, get, update, and delete prompts using the REST API functions.

```typescript
import {
  listPrompts,
  createPrompt,
  getPrompt,
  updatePrompt,
  deletePrompt,
} from "@arizeai/ax-client";

// List all prompts
const { data: prompts } = await listPrompts({ spaceId: "space-id" });

// Create a new prompt
const prompt = await createPrompt({
  spaceId: "space-id",
  name: "my-prompt",
  commitMessage: "Initial version",
  inputVariableFormat: "f_string",
  provider: "openAI",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, {name}!" },
  ],
});

// Get a specific prompt
const fetched = await getPrompt({ promptId: prompt.id });

// Update prompt metadata
const updated = await updatePrompt({
  promptId: prompt.id,
  description: "Updated description",
  tags: ["production"],
});

// Delete a prompt
await deletePrompt({ promptId: prompt.id });
```

### Retrieving full prompt content (alpha)

Full prompt content including messages, LLM parameters, and version history is available via GraphQL-backed functions. These are in alpha and may change.

```typescript
import { getPromptContent, listPromptsWithContent } from "@arizeai/ax-client";

// Get full content by GraphQL node ID (base64-encoded Relay Global ID)
const content = await getPromptContent({
  promptNodeId: "your_relay_node_id",
  versionLimit: 10,
});
console.log(content.versions);

// Or look up by name (requires the space's Relay node ID)
const contentByName = await getPromptContent({
  promptName: "my-prompt",
  spaceNodeId: "your_space_relay_node_id",
  versionLimit: 5,
});

// List prompts with full content
const { data: promptsWithContent } = await listPromptsWithContent({
  spaceNodeId: "your_space_relay_node_id",
});
```

> **Note:** GraphQL functions require Relay Global IDs (base64-encoded node IDs), which differ from the REST API IDs returned by `getPrompt()`. Relay IDs can be obtained from the Arize AX UI or via the GraphQL API.

### Pushing prompts (alpha)

Create a new prompt or add a new version to an existing prompt via the GraphQL API.

```typescript
import { pushPrompt } from "@arizeai/ax-client";

const result = await pushPrompt({
  spaceNodeId: "your_space_relay_node_id",
  name: "my-prompt",
  messages: [{ role: "system", content: "You are a helpful assistant" }],
  commitMessage: "Initial version",
  inputVariableFormat: "mustache",
  provider: "openAI",
});

console.log(result.action); // "created" or "updated"
console.log(result.promptId);
```

## REST endpoints

It is recommended to use the methods in this package. If more control is desired, you can use the client directly. The client provides a type-safe fetch for the entire Arize AX REST API.

```typescript
import { createClient } from "@arizeai/ax-client";

const client = createClient();

// Get all datasets
const response = await client.GET("/v2/datasets");
```
