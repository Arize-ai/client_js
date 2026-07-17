import { describe, expect, it } from "vitest";
import { transformUser, transformUserCreated } from "../utils";
import { mockRawUser, mockRawUserCreated } from "./fixtures";

describe("transformUser", () => {
  it("should transform snake_case fields to camelCase and parse created_at as Date", () => {
    const expectedResult = {
      id: mockRawUser.id,
      name: mockRawUser.name,
      email: mockRawUser.email,
      role: mockRawUser.role,
      status: mockRawUser.status,
      createdAt: new Date(mockRawUser.created_at),
      isDeveloper: mockRawUser.is_developer,
    };
    const user = transformUser(mockRawUser);
    expect(user).toEqual(expectedResult);
  });
});

describe("transformUserCreated", () => {
  it("should transform snake_case fields to camelCase including invite_mode", () => {
    const expectedResult = {
      id: mockRawUserCreated.id,
      name: mockRawUserCreated.name,
      email: mockRawUserCreated.email,
      role: mockRawUserCreated.role,
      status: mockRawUserCreated.status,
      createdAt: new Date(mockRawUserCreated.created_at),
      isDeveloper: mockRawUserCreated.is_developer,
      inviteMode: mockRawUserCreated.invite_mode,
    };
    const user = transformUserCreated(mockRawUserCreated);
    expect(user).toEqual(expectedResult);
  });

  it("should include temporaryPassword when present", () => {
    const rawWithPassword = {
      ...mockRawUserCreated,
      invite_mode: "TEMPORARY_PASSWORD" as const,
      temporary_password: "temp-pass-123",
    };
    const user = transformUserCreated(rawWithPassword);
    expect(user.inviteMode).toBe("TEMPORARY_PASSWORD");
    if (user.inviteMode === "TEMPORARY_PASSWORD") {
      expect(user.temporaryPassword).toBe("temp-pass-123");
    }
  });
});
