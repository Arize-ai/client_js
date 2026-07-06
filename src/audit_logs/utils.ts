import { AuditLog } from "../types";
import { RawAuditLog } from "../types/internal";

export function transformAuditLog(raw: RawAuditLog): AuditLog {
  return {
    id: raw.id,
    userId: raw.user_id,
    ip: raw.ip,
    operationType: raw.operation_type,
    operationName: raw.operation_name,
    operationText: raw.operation_text,
    variables: raw.variables,
    createdAt: new Date(raw.created_at),
  };
}
