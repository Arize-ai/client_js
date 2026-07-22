import { createApiKey } from "../src/api_keys";

(async () => {
  // User key — authenticates as the creating user with their full permissions
  try {
    const userKey = await createApiKey({
      keyType: "USER",
      name: "example-user-key",
    });
    // eslint-disable-next-line no-console
    console.log(
      "User key created. Store this value securely — it is only shown once:",
    );
    // eslint-disable-next-line no-console
    console.log(userKey.key ? `${userKey.key.slice(0, 6)}...[redacted]` : "");
    // eslint-disable-next-line no-console
    console.dir({ ...userKey, key: "[redacted]" }, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating user key:", error);
  }

  // Service key — backed by a bot user scoped to specific orgs and spaces.
  // Replace the IDs below with real values from your Arize account.
  try {
    const serviceKey = await createApiKey({
      keyType: "SERVICE",
      name: "example-service-key",
      organizations: [
        {
          orgId: "<org-hmac-id>",
          spaces: [{ spaceId: "<space-hmac-id>", role: { name: "MEMBER" } }],
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.log(
      "Service key created. Store this value securely — it is only shown once:",
    );
    // eslint-disable-next-line no-console
    console.log(
      serviceKey.key ? `${serviceKey.key.slice(0, 6)}...[redacted]` : "",
    );
    // eslint-disable-next-line no-console
    console.dir(serviceKey.botUser, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating service key:", error);
  }
})();
