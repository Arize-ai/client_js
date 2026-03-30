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

Alternatively, you can pass configuration options to the client directly,
and they will be prioritized over environment variables and default values.

## Datasets

The `@arizeai/ax-client` package allows you to create and manage datasets.

### Creating a dataset

Create a dataset by providing a space (name or ID), name, and array of examples (each containing at least one property). There are a few examples below, check out our docs for full documentation.

```typescript
import { createDataset } from "@arizeai/ax-client";

const dataset = await createDataset({
  name: "my-dataset",
  space: "my-space",
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

You can list experiment runs by providing an experiment name or ID (space and dataset context are required when using names). There are a few examples below, check out our docs for full documentation.

```typescript
import { listExperimentRuns } from "@arizeai/ax-client";

const experimentRuns = await listExperimentRuns({
  space: "my-space",
  dataset: "my-dataset",
  experiment: "my-experiment",
});
```

## API Keys

The `@arizeai/ax-client` package allows you to create, list, delete, and refresh API keys.

### Creating an API key

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
  keyType: "service",
  spaceId: "your-space-id",
  roles: { spaceRole: "member" },
  expiresAt: new Date("2027-01-01"),
});
```

### Listing API keys

```typescript
import { listApiKeys } from "@arizeai/ax-client";

const { data } = await listApiKeys();
console.log(data.map((k) => k.name));

// Filter by key type or status
const { data: userKeys } = await listApiKeys({ keyType: "user" });
```

### Deleting an API key

```typescript
import { deleteApiKey } from "@arizeai/ax-client";

await deleteApiKey({ apiKeyId: "your-api-key-id" });
```

### Refreshing an API key

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

## Roles

The `@arizeai/ax-client` package allows you to create and manage custom roles.

### Creating a role

```typescript
import { createRole } from "@arizeai/ax-client";

const role = await createRole({
  name: "AI Engineer",
  permissions: ["PROJECT_READ", "DATASET_READ", "DATASET_CREATE"],
  description: "Can read and create datasets and experiments.",
});
```

### Listing roles

```typescript
import { listRoles } from "@arizeai/ax-client";

const { data } = await listRoles();
console.log(data.map((r) => r.name));

// Filter to only predefined (system) roles
const { data: predefined } = await listRoles({ isPredefined: true });
```

### Getting a role

```typescript
import { getRole } from "@arizeai/ax-client";

const role = await getRole({ roleId: "your-role-id" });
```

### Updating a role

```typescript
import { updateRole } from "@arizeai/ax-client";

const role = await updateRole({
  roleId: "your-role-id",
  permissions: ["PROJECT_READ", "DATASET_READ"],
});
```

### Deleting a role

```typescript
import { deleteRole } from "@arizeai/ax-client";

await deleteRole({ roleId: "your-role-id" });
```

## REST endpoints

It is recommended to use the methods in this package. If more control is desired, you can use the client directly. The client provides a type-safe fetch for the entire Arize AX REST API.

```typescript
import { createClient } from "@arizeai/ax-client";

const client = createClient();

// Get all datasets
const response = await client.GET("/v2/datasets");
```
