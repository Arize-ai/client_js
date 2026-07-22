import { createClient } from "../client";
import {
  ApiKeyAccountRoleAssignment,
  ApiKeyCreated,
  ApiKeyOrgRoleAssignment,
  ApiKeySpaceRoleAssignment,
  WithClient,
} from "../types";
import { components } from "../__generated__/api/v2";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformApiKeyCreated } from "./utils";
import { RawApiKeyCreated } from "../types/internal";

type RawUserApiKeyCreate = components["schemas"]["CreateUserApiKeyRequest"];
type RawServiceApiKeyCreate =
  components["schemas"]["CreateServiceApiKeyRequest"];

/**
 * Inject the `type` discriminator field that the server requires but that the
 * generated TypeScript types omit via `Omit<..., "type">`.
 * Predefined roles carry a `name`; custom roles carry an `id`.
 */
function withRoleType(
  role:
    | ApiKeySpaceRoleAssignment
    | ApiKeyOrgRoleAssignment
    | ApiKeyAccountRoleAssignment,
): Record<string, unknown> {
  // Cast to a partial shape to read `id` without unsafe `any`.
  // We use typeof + length check rather than `"id" in role` so that `{ id: undefined }`
  // or `{ id: "" }` are not misclassified as custom roles.
  const id = (role as Partial<{ id: string }>).id;
  if (typeof id === "string" && id.length > 0) {
    return { ...role, type: "CUSTOM" };
  }
  return { ...role, type: "PREDEFINED" };
}

export type CreateUserApiKeyParams = WithClient<{
  /** The required key type discriminator. */
  keyType: "USER";
  name: string;
  description?: string;
  expiresAt?: Date | string;
}>;

export type CreateServiceApiKeyParams = WithClient<{
  /** The required key type discriminator. */
  keyType: "SERVICE";
  name: string;
  /**
   * Optional account-level role for the bot user. When omitted, the server
   * applies the default predefined `member` role.
   */
  accountRole?: ApiKeyAccountRoleAssignment;
  /**
   * Organization bindings for the bot user. At least one organization with at
   * least one space is required.
   */
  organizations: [
    {
      orgId: string;
      role?: ApiKeyOrgRoleAssignment;
      spaces: [
        { spaceId: string; role?: ApiKeySpaceRoleAssignment },
        ...{ spaceId: string; role?: ApiKeySpaceRoleAssignment }[],
      ];
    },
    ...{
      orgId: string;
      role?: ApiKeyOrgRoleAssignment;
      spaces: [
        { spaceId: string; role?: ApiKeySpaceRoleAssignment },
        ...{ spaceId: string; role?: ApiKeySpaceRoleAssignment }[],
      ];
    }[],
  ];
  description?: string;
  expiresAt?: Date | string;
}>;

export type CreateApiKeyParams =
  | CreateUserApiKeyParams
  | CreateServiceApiKeyParams;

/**
 * Create a new API key.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param keyType - The required key type: `"USER"` or `"SERVICE"`.
 * @param name - The name of the API key.
 * @param description - An optional description for the API key.
 * @param expiresAt - Optional expiration date. If omitted, the key never expires.
 * @param organizations - Required for service keys. List of organization bindings, each containing an optional org-level role and space bindings.
 * @param accountRole - Optional account-level role for the bot user. When omitted, the server applies the default predefined `member` role.
 * @returns A {@link ApiKeyCreated} containing the full key value. **Store the `key` field securely — it is only returned once.**
 * @throws Error if the API key cannot be created or the response is invalid.
 * @example User key (simplest case):
 * ```typescript
 * import { createApiKey } from "@arizeai/ax-client"
 *
 * // User key
 * const userKey = await createApiKey({ keyType: "USER", name: "CI pipeline key" });
 * console.log(userKey.key); // Store this securely — returned only once
 *
 * // Service key with org and space bindings
 * const serviceKey = await createApiKey({
 *   keyType: "SERVICE",
 *   name: "bot-key",
 *   organizations: [
 *     {
 *       orgId: "T3JnMTIz",
 *       spaces: [
 *         { spaceId: "U3BhY2UxMjM", role: { name: "MEMBER" } },
 *         { spaceId: "U3BhY2U0NTY", role: { name: "READ_ONLY" } },
 *       ],
 *     },
 *   ],
 * });
 * ```
 * @example Service key with account-level role:
 * ```typescript
 * const apiKey = await createApiKey({
 *   keyType: "SERVICE",
 *   name: "CI service key",
 *   accountRole: { name: "MEMBER" },
 *   organizations: [{ orgId: "T3JnMTIz", spaces: [{ spaceId: "U3BhY2UxMjM" }] }],
 * });
 * ```
 */
export async function createApiKey(
  params: CreateApiKeyParams,
): Promise<ApiKeyCreated> {
  warnPreRelease({ functionName: "createApiKey", stage: "alpha" });
  const { client: clientInstance, name, description, expiresAt } = params;
  const client = clientInstance ?? createClient();
  const expiresAtStr =
    expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt;

  let body: RawUserApiKeyCreate | RawServiceApiKeyCreate;
  if (params.keyType === "SERVICE") {
    if (!("organizations" in params)) {
      throw new Error("organizations is required when keyType is SERVICE");
    }
    const { organizations, accountRole } = params;
    body = {
      key_type: "SERVICE",
      name,
      description,
      expires_at: expiresAtStr,
      ...(accountRole != null
        ? { account_role: withRoleType(accountRole) }
        : {}),
      organizations: organizations.map((orgBinding) => ({
        org_id: orgBinding.orgId,
        ...(orgBinding.role != null
          ? { role: withRoleType(orgBinding.role) }
          : {}),
        spaces: orgBinding.spaces.map((spaceBinding) => ({
          space_id: spaceBinding.spaceId,
          ...(spaceBinding.role != null
            ? { role: withRoleType(spaceBinding.role) }
            : {}),
        })),
      })),
    };
  } else if (params.keyType === "USER") {
    if ("organizations" in params) {
      throw new Error("organizations is only valid when keyType is SERVICE");
    }
    body = {
      key_type: "USER",
      name,
      description,
      expires_at: expiresAtStr,
    };
  } else {
    throw new Error("unsupported keyType");
  }

  const response = await client.POST("/v2/api-keys", { body });
  if (response.error) {
    return handleApiError(response);
  }
  return transformApiKeyCreated(response.data as unknown as RawApiKeyCreated);
}
