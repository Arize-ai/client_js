# Arize AX TS Client

This package provides a TypeScript client for the Arize AX REST API. It is still under active development and is subject to change.

## Installation

```bash
# or yarn, pnpm, bun, etc...
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

You can create a dataset by providing a spaceId, name, and array of examples (each containing at least one property). There are a few examples below, check out our docs for full documentation.

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

## REST endpoints

It is recommended to use the methods in this package. If more control is desired, you can use the client directly. The client provides a type-safe fetch for the entire Arize AX REST API.

```typescript
import { createClient } from "@arizeai/ax-client";

const client = createClient();

// Get all datasets
const response = await client.GET("/v2/datasets");
```
