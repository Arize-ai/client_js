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

## Projects

The `@arizeai/ax-client` package allows you to create and manage projects.

### Creating a project

```typescript
import { createProject } from "@arizeai/ax-client";

const project = await createProject({
  space: "my-space",
  name: "my-project",
});
console.log(project);
```

### Getting a project

```typescript
import { getProject } from "@arizeai/ax-client";

const project = await getProject({
  project: "my-project",
  space: "my-space",
});
console.log(project);
```

### Listing projects

```typescript
import { listProjects } from "@arizeai/ax-client";

const { projects } = await listProjects({ space: "my-space" });
console.log(projects);
```

### Updating a project

```typescript
import { updateProject } from "@arizeai/ax-client";

const project = await updateProject({
  project: "my-project",
  space: "my-space",
  name: "my-renamed-project",
});
console.log(project);
```

### Deleting a project

```typescript
import { deleteProject } from "@arizeai/ax-client";

await deleteProject({ project: "my-project", space: "my-space" });
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

// List service keys for a specific space
const { data: serviceKeys } = await listApiKeys({
  keyType: "service",
  spaceId: "U3BhY2U6MTIzNDU=",
});

// List service keys created by a specific user (any caller with space access)
const { data: byUser } = await listApiKeys({
  spaceId: "U3BhY2U6MTIzNDU=",
  userId: "VXNlcjoxMjM0NQ==",
});
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

## Organizations

The `@arizeai/ax-client` package allows you to manage organizations.

### Listing organizations

```typescript
import { listOrganizations } from "@arizeai/ax-client";

const result = await listOrganizations();
console.log(result.organizations);
```

### Getting an organization

```typescript
import { getOrganization } from "@arizeai/ax-client";

const org = await getOrganization({ organization: "your-organization-name" });
console.log(org);
```

### Creating an organization

```typescript
import { createOrganization } from "@arizeai/ax-client";

const org = await createOrganization({
  name: "your-organization-name",
  description: "Optional description",
});
console.log(org);
```

### Updating an organization

```typescript
import { updateOrganization } from "@arizeai/ax-client";

const org = await updateOrganization({
  organization: "your-organization-name",
  name: "your-organization-name-updated",
});
console.log(org);
```

### Deleting an organization

> **Warning:** This operation is irreversible and deletes the organization
> and all resources that belong to it, including all spaces and their contents.

```typescript
import { deleteOrganization } from "@arizeai/ax-client";

await deleteOrganization({ organization: "your-organization-name" });
```

## Organization memberships

### Adding a user to an organization

```typescript
import { addOrganizationUser } from "@arizeai/ax-client";

const membership = await addOrganizationUser({
  organizationId: "org_abc123",
  userId: "VXNlcjoxMjM0NQ==",
  role: { type: "predefined", name: "member" },
});
console.log(membership);
```

### Removing a user from an organization

```typescript
import { removeOrganizationUser } from "@arizeai/ax-client";

await removeOrganizationUser({
  organizationId: "org_abc123",
  userId: "VXNlcjoxMjM0NQ==",
});
```

## Users

The `@arizeai/ax-client` package allows you to manage users.

> **Note:** Unlike organizations, users are identified by opaque ID only — not
> by name. User display names are not unique within an account, so all functions
> require the user's ID.

### Listing users

```typescript
import { listUsers } from "@arizeai/ax-client";

const result = await listUsers();
console.log(result.data);
```

### Getting a user

```typescript
import { getUser } from "@arizeai/ax-client";

const user = await getUser({ userId: "VXNlcjoxMjM0NQ==" });
console.log(user);
```

### Creating a user

The `inviteMode` parameter controls how the user is invited:

- `"email_link"` — sends the user an email with a verification link.
- `"temporary_password"` — issues a one-time password returned in the response.
- `"none"` — pre-provisions an SSO user directly; no invitation is sent and the
  user is immediately active via the configured identity provider.

Returns a `UserCreated` object (HTTP 201) for a new user, or a `User` object
(HTTP 200) when an existing `invited` user is returned as-is (idempotent — the
invitation is not resent).

```typescript
import { createUser } from "@arizeai/ax-client";

const user = await createUser({
  name: "Jane Smith",
  email: "jane.smith@example.com",
  role: { type: "predefined", name: "member" },
  inviteMode: "email_link",
});
console.log(user);
```

### Updating a user

```typescript
import { updateUser } from "@arizeai/ax-client";

const user = await updateUser({
  userId: "VXNlcjoxMjM0NQ==",
  name: "Jane Smith Updated",
  isDeveloper: true,
});
console.log(user);
```

### Deleting a user

> **Warning:** This operation permanently blocks the user from the account.
> Blocked users cannot be re-invited — inactive is a terminal state. The
> operation cascades to organization memberships, space memberships, API keys,
> and role bindings.

```typescript
import { deleteUser } from "@arizeai/ax-client";

await deleteUser({ userId: "VXNlcjoxMjM0NQ==" });
```

### Resending a user invitation

```typescript
import { resendInvitation } from "@arizeai/ax-client";

await resendInvitation({ userId: "VXNlcjoxMjM0NQ==" });
```

## Space memberships

### Adding a user to a space

```typescript
import { addSpaceUser } from "@arizeai/ax-client";

const membership = await addSpaceUser({
  spaceId: "spc_abc123",
  userId: "VXNlcjoxMjM0NQ==",
  role: { type: "predefined", name: "member" },
});
console.log(membership);
```

### Removing a user from a space

```typescript
import { removeSpaceUser } from "@arizeai/ax-client";

await removeSpaceUser({
  spaceId: "spc_abc123",
  userId: "VXNlcjoxMjM0NQ==",
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
