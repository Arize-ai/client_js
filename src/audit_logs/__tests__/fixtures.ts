import type { RawAuditLog } from "../../types/internal";

export const mockRawAuditLog: RawAuditLog = {
  id: "QXVkaXRMb2c6NDI=",
  user_id: "VXNlcjoxMjM0NQ==",
  ip: "1.2.3.4",
  operation_type: "QUERY",
  operation_name: "getSpans",
  operation_text: "query getSpans { ... }",
  variables: "{}",
  created_at: "2026-05-18T12:00:00.000Z",
};

export const mockRawAuditLogMinimal: RawAuditLog = {
  id: "QXVkaXRMb2c6OTk=",
  user_id: "VXNlcjo5OTk=",
  ip: "5.6.7.8",
  operation_type: "MUTATION",
  created_at: "2026-05-19T08:30:00.000Z",
};
