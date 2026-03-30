import type { RawPermission } from "./internal";

export type Permission = RawPermission;

export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isPredefined: boolean;
  createdAt: Date;
  updatedAt: Date;
};
