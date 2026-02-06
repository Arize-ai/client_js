# Development Guide for @arizeai/ax-client

This package provides a TypeScript client for the Arize AX REST API. It utilizes [openapi-ts](https://openapi-ts.dev/) to generate the types from the Arize AX OpenAPI specification and [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) to make type-safe requests to the API. The client provides additional convenience functions, error handling, and data transformations for a better developer experience.

## Code generation

Code generation keeps the TypeScript types and API interfaces in sync with the OpenAPI specification. The generated code is output to `src/__generated__/api/v2.ts` in the `ax-client` package.

### Regenerating types after specification changes

From the root of the Arize monorepo, run:

```sh
./recompile_openapi.sh
```

The ax-client package also has its own generate script, but in the typical development workflow where client changes are made after changes to the OpenAPI specification and REST API, you should not need to regenerate types while developing in the client.

## Testing Changes

### Using the examples directory

You can follow the README.md in the examples directory for testing changes by running examples using `tsx`.

### Using pnpm link

To test unpublished changes in your own external project, you can use pnpm link - pnpm link creates a symbolic link between your local development package and the global pnpm store, allowing other projects to use the local package.

### 1. Build and link from the package directory

```sh
pnpm run build
```

```sh
pnpm link --global
```

You'll need to run `pnpm run build` again after making changes to see them in your project.

### 2. Use the link in your project

```sh
pnpm link --global @arizeai/ax-client
```
