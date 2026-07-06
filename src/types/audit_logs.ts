import type { components } from "../__generated__/api/v2";

export type AuditLogOperationType =
  components["schemas"]["AuditLogOperationType"];

export type AuditLog = {
  /** The base64-encoded opaque identifier of the audit log entry. */
  id: string;
  /** The global identifier of the user who performed the action. */
  userId: string;
  /** The IP address from which the request originated. */
  ip: string;
  operationType: AuditLogOperationType;
  /** The name of the GraphQL operation or REST endpoint. */
  operationName?: string | null;
  /** The full text of the operation (query or mutation body, or REST request body). */
  operationText?: string | null;
  /** JSON-serialized variables passed with the operation. */
  variables?: string | null;
  /** ISO 8601 timestamp when the action was recorded. */
  createdAt: Date;
};
