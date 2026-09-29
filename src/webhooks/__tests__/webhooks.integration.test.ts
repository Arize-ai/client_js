/**
 * Integration tests for the webhooks client.
 *
 * These tests hit the real Arize API and require:
 *   - ARIZE_API_KEY env var
 *   - ARIZE_TEST_ORGANIZATION env var — the organization ID or name to run
 *     against
 *   - ARIZE_BASE_URL env var — optional, defaults to production
 *
 * The whole file is skipped unless both ARIZE_API_KEY and
 * ARIZE_TEST_ORGANIZATION are set, so `pnpm test` never runs it by accident.
 * Run it on its own with:
 *   ARIZE_API_KEY=... ARIZE_TEST_ORGANIZATION=... pnpm vitest run src/webhooks/__tests__/webhooks.integration.test.ts
 *
 * Tests run in file order and share state. Every resource created here is
 * named `ts-sdk-itest-<timestamp>-…` and deleted in afterAll whether or not
 * the tests pass.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createClient } from "../../client";
import { listOrganizations } from "../../organizations";
import { listSpaces } from "../../spaces";
import { createPrompt, deletePrompt, listPrompts } from "../../prompts";
import {
  createWebhook,
  createWebhookSubscription,
  deleteWebhook,
  deleteWebhookSubscription,
  getWebhook,
  getWebhookSubscription,
  listWebhookDeliveryAttempts,
  listWebhooks,
  listWebhookSubscriptions,
  testWebhook,
  updateWebhook,
} from "..";
import {
  APIError,
  BadRequestError,
  NotFoundError,
  ResolutionError,
} from "../../errors";
import { isResourceId } from "../../utils/resolve";
import type {
  CreatedWebhook,
  Organization,
  WebhookSubscription,
} from "../../types";

const apiKey = process.env.ARIZE_API_KEY;
const organizationOverride = process.env.ARIZE_TEST_ORGANIZATION;

const shouldRun = Boolean(apiKey && organizationOverride);

vi.setConfig({ testTimeout: 30_000, hookTimeout: 120_000 });

const prefix = `ts-sdk-itest-${Date.now()}`;
const bearerName = `${prefix}-bearer`;
const hmacName = `${prefix}-hmac`;
const renamedBearerName = `${prefix}-bearer-renamed`;
const promptName = `${prefix}-prompt`;
const targetUrl = "https://example.com/hook";
const initialDescription = "created by the ts sdk integration tests";

/** Resolves to the rejection reason, or to undefined when the promise fulfils. */
async function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
    return undefined;
  } catch (error) {
    return error;
  }
}

describe.skipIf(!shouldRun)("webhooks (integration)", () => {
  const client = shouldRun ? createClient({ apiKey }) : (null as never);

  let organization: Organization;
  let promptId: string;
  let createdPromptId: string | undefined;
  let bearer: CreatedWebhook;
  let hmac: CreatedWebhook;
  let subscription: WebhookSubscription | undefined;

  async function pickOrganization(): Promise<Organization> {
    const response = await listOrganizations({ client, limit: 100 });
    if (organizationOverride) {
      const match = response.data.find(
        (org) =>
          org.id === organizationOverride || org.name === organizationOverride,
      );
      if (!match) {
        throw new Error(
          `ARIZE_TEST_ORGANIZATION '${organizationOverride}' is not among the first 100 organizations this key can read.`,
        );
      }
      return match;
    }
    const first = response.data[0];
    if (!first) {
      throw new Error("The API key cannot read any organization.");
    }
    return first;
  }

  beforeAll(async () => {
    organization = await pickOrganization();

    const spaces = await listSpaces({
      client,
      organizationId: organization.id,
      limit: 1,
    });
    const space = spaces.data[0];
    if (!space) {
      throw new Error(
        `Organization '${organization.name}' has no space to hold the test prompt.`,
      );
    }

    const prompts = await listPrompts({ client, space: space.id, limit: 1 });
    const existing = prompts.data[0];
    if (existing) {
      promptId = existing.id;
      return;
    }
    const created = await createPrompt({
      client,
      space: space.id,
      name: promptName,
      version: {
        commitMessage: "initial version",
        inputVariableFormat: "F_STRING",
        provider: "OPEN_AI",
        model: "gpt-4o-mini",
        messages: [{ role: "USER", content: "Hello {name}" }],
      },
    });
    createdPromptId = created.id;
    promptId = created.id;
  });

  afterAll(async () => {
    if (!organization) return;

    const deletions: Promise<unknown>[] = [];
    if (subscription) {
      deletions.push(
        deleteWebhookSubscription({ client, subscriptionId: subscription.id }),
      );
    }
    const leftovers = await listWebhooks({
      client,
      organization: organization.id,
      name: prefix,
      limit: 100,
    });
    for (const webhook of leftovers.data) {
      deletions.push(deleteWebhook({ client, webhook: webhook.id }));
    }
    if (createdPromptId) {
      deletions.push(deletePrompt({ client, prompt: createdPromptId }));
    }

    const results = await Promise.allSettled(deletions);
    const failures = results.flatMap((result) =>
      result.status === "rejected" && !(result.reason instanceof NotFoundError)
        ? [String(result.reason)]
        : [],
    );
    if (failures.length > 0) {
      throw new Error(`Cleanup failed:\n${failures.join("\n")}`);
    }
  });

  // ── Create ─────────────────────────────────────────────────────────

  describe("createWebhook", () => {
    it("creates a BEARER webhook and never returns its credentials", async () => {
      bearer = await createWebhook({
        client,
        organization: organization.id,
        name: bearerName,
        url: targetUrl,
        description: initialDescription,
        authToken: "Bearer ts-sdk-itest-token",
        headers: { "X-Test-Run": prefix },
        timeoutMs: 5000,
      });

      expect(isResourceId(bearer.id)).toBe(true);
      expect(bearer.organizationId).toBe(organization.id);
      expect(bearer.name).toBe(bearerName);
      expect(bearer.url).toBe(targetUrl);
      expect(bearer.description).toBe(initialDescription);
      expect(bearer.authType).toBe("BEARER");
      expect(bearer.timeoutMs).toBe(5000);
      expect(bearer.createdAt).toBeInstanceOf(Date);
      expect(Number.isNaN(bearer.createdAt.getTime())).toBe(false);
      expect(bearer.updatedAt).toBeInstanceOf(Date);
      expect(bearer.signingSecret).toBeUndefined();
      expect(bearer.signingSecretHint).toBeUndefined();
      expect(bearer).not.toHaveProperty("authToken");
      expect(bearer).not.toHaveProperty("headers");
    });

    it("creates an HMAC_SHA256 webhook and returns the signing secret once", async () => {
      hmac = await createWebhook({
        client,
        organization: organization.id,
        name: hmacName,
        url: targetUrl,
        authType: "HMAC_SHA256",
      });

      expect(isResourceId(hmac.id)).toBe(true);
      expect(hmac.authType).toBe("HMAC_SHA256");
      expect(hmac.description).toBe("");
      expect(hmac.timeoutMs).toBe(30000);
      expect(hmac.signingSecret).toEqual(expect.any(String));
      expect(hmac.signingSecret).not.toBe("");
      expect(hmac.signingSecretHint).toEqual(expect.any(String));
      expect(hmac.signingSecretHint).not.toBe("");
      expect(hmac).not.toHaveProperty("authToken");
      expect(hmac).not.toHaveProperty("headers");
    });
  });

  // ── Get ────────────────────────────────────────────────────────────

  describe("getWebhook", () => {
    it("gets a webhook by ID without credentials", async () => {
      const fetched = await getWebhook({ client, webhook: bearer.id });

      expect(fetched.id).toBe(bearer.id);
      expect(fetched.name).toBe(bearerName);
      expect(fetched.organizationId).toBe(organization.id);
      expect(fetched.signingSecretHint).toBeUndefined();
      expect(fetched).not.toHaveProperty("signingSecret");
      expect(fetched).not.toHaveProperty("authToken");
      expect(fetched).not.toHaveProperty("headers");
    });

    it("returns only the signing secret hint for an HMAC_SHA256 webhook", async () => {
      const fetched = await getWebhook({ client, webhook: hmac.id });

      expect(fetched.id).toBe(hmac.id);
      expect(fetched.signingSecretHint).toBe(hmac.signingSecretHint);
      expect(fetched).not.toHaveProperty("signingSecret");
    });

    it("gets a webhook by name with the organization name", async () => {
      const fetched = await getWebhook({
        client,
        webhook: bearerName,
        organization: organization.name,
      });
      expect(fetched.id).toBe(bearer.id);
    });

    it("gets a webhook by name with the organization ID", async () => {
      const fetched = await getWebhook({
        client,
        webhook: hmacName,
        organization: organization.id,
      });
      expect(fetched.id).toBe(hmac.id);
    });

    it("throws ResolutionError listing near misses for an unknown name", async () => {
      const error = await rejectionOf(
        getWebhook({ client, webhook: prefix, organization: organization.id }),
      );

      expect(error).toBeInstanceOf(ResolutionError);
      const resolution = error as ResolutionError;
      expect(resolution.resourceType).toBe("webhook");
      expect(resolution.resourceName).toBe(prefix);
      expect(resolution.availableNames).toEqual(
        expect.arrayContaining([bearerName, hmacName]),
      );
    });
  });

  // ── List ───────────────────────────────────────────────────────────

  describe("listWebhooks", () => {
    it("filters by name substring", async () => {
      const response = await listWebhooks({
        client,
        organization: organization.id,
        name: prefix,
      });

      const ids = response.data.map((webhook) => webhook.id);
      expect(ids).toEqual(expect.arrayContaining([bearer.id, hmac.id]));
      for (const webhook of response.data) {
        expect(webhook.name.startsWith(prefix)).toBe(true);
        expect(webhook).not.toHaveProperty("signingSecret");
      }
    });

    it("paginates with limit 1 until hasMore is false", async () => {
      const ids: string[] = [];
      let cursor: string | undefined;
      let pages = 0;

      do {
        const page = await listWebhooks({
          client,
          organization: organization.id,
          name: prefix,
          limit: 1,
          cursor,
        });
        pages += 1;
        expect(page.data.length).toBeLessThanOrEqual(1);
        ids.push(...page.data.map((webhook) => webhook.id));
        cursor = page.pagination.hasMore
          ? page.pagination.nextCursor
          : undefined;
        if (page.pagination.hasMore) {
          expect(cursor).toEqual(expect.any(String));
        }
        if (pages > 10) {
          throw new Error("Pagination did not finish after 10 pages.");
        }
      } while (cursor);

      expect(pages).toBeGreaterThanOrEqual(2);
      expect(ids).toEqual(expect.arrayContaining([bearer.id, hmac.id]));
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  // ── Update ─────────────────────────────────────────────────────────

  describe("updateWebhook", () => {
    it("updates name and timeoutMs and leaves other fields alone", async () => {
      const updated = await updateWebhook({
        client,
        webhook: bearer.id,
        name: renamedBearerName,
        timeoutMs: 7000,
      });

      expect(updated.id).toBe(bearer.id);
      expect(updated.name).toBe(renamedBearerName);
      expect(updated.timeoutMs).toBe(7000);
      expect(updated.url).toBe(bearer.url);
      expect(updated.description).toBe(initialDescription);
      expect(updated.authType).toBe("BEARER");
      expect(updated.organizationId).toBe(organization.id);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        bearer.updatedAt.getTime(),
      );

      const fetched = await getWebhook({ client, webhook: bearer.id });
      expect(fetched.name).toBe(renamedBearerName);
      expect(fetched.timeoutMs).toBe(7000);
    });

    it("clears the description with null", async () => {
      const updated = await updateWebhook({
        client,
        webhook: bearer.id,
        description: null,
      });

      expect(updated.description).toBe("");
      expect(updated.name).toBe(renamedBearerName);
    });

    it("throws before any request when nothing is provided", async () => {
      // A client aimed at an unreachable port: a validation message, not a
      // network error, proves the request never left.
      const offline = createClient({
        apiKey: "unused",
        baseUrl: "http://127.0.0.1:9",
      });

      await expect(
        updateWebhook({ client: offline, webhook: bearer.id }),
      ).rejects.toThrow(
        "At least one of name, description, url, authToken, timeoutMs, or headers must be provided.",
      );
    });
  });

  // ── Test delivery and delivery attempts ────────────────────────────

  describe("testWebhook", () => {
    it("returns the endpoint's response for a BEARER webhook", async () => {
      const result = await testWebhook({ client, webhook: bearer.id });

      expect(typeof result.statusCode).toBe("number");
      expect(Number.isInteger(result.statusCode)).toBe(true);
      expect(
        result.errorMessage === null || typeof result.errorMessage === "string",
      ).toBe(true);
    });

    it("throws BadRequestError for an HMAC_SHA256 webhook", async () => {
      const error = await rejectionOf(
        testWebhook({ client, webhook: hmac.id }),
      );

      expect(error).toBeInstanceOf(BadRequestError);
      expect((error as BadRequestError).statusCode).toBe(400);
    });
  });

  describe("listWebhookDeliveryAttempts", () => {
    it("returns an empty page for a webhook with no event deliveries", async () => {
      const response = await listWebhookDeliveryAttempts({
        client,
        webhook: bearer.id,
      });

      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toEqual([]);
      expect(response.pagination.hasMore).toBe(false);
    });
  });

  // ── Subscriptions ──────────────────────────────────────────────────

  describe("webhook subscriptions", () => {
    it("creates a PROMPT_VERSION_CREATED subscription on a prompt", async () => {
      subscription = await createWebhookSubscription({
        client,
        webhook: bearer.id,
        sourceType: "PROMPT",
        sourceId: promptId,
        event: "PROMPT_VERSION_CREATED",
      });

      expect(isResourceId(subscription.id)).toBe(true);
      expect(subscription.webhookId).toBe(bearer.id);
      expect(subscription.sourceType).toBe("PROMPT");
      expect(subscription.sourceId).toBe(promptId);
      expect(subscription.event).toBe("PROMPT_VERSION_CREATED");
      expect(subscription.createdAt).toBeInstanceOf(Date);
    });

    it("rejects a duplicate subscription with 409", async () => {
      const error = await rejectionOf(
        createWebhookSubscription({
          client,
          webhook: bearer.id,
          sourceType: "PROMPT",
          sourceId: promptId,
          event: "PROMPT_VERSION_CREATED",
        }),
      );

      expect(error).toBeInstanceOf(APIError);
      expect((error as APIError).statusCode).toBe(409);
    });

    it("rejects an event that does not belong to the source type with 422", async () => {
      const error = await rejectionOf(
        createWebhookSubscription({
          client,
          webhook: bearer.id,
          sourceType: "PROMPT",
          sourceId: promptId,
          event: "EVALUATOR_VERSION_CREATED",
        }),
      );

      expect(error).toBeInstanceOf(APIError);
      expect((error as APIError).statusCode).toBe(422);
    });

    it("lists the subscription by source", async () => {
      const response = await listWebhookSubscriptions({
        client,
        sourceType: "PROMPT",
        sourceId: promptId,
      });

      const ids = response.data.map((item) => item.id);
      expect(ids).toContain(subscription!.id);
      expect(typeof response.pagination.hasMore).toBe("boolean");
    });

    it("gets the subscription by ID", async () => {
      const fetched = await getWebhookSubscription({
        client,
        subscriptionId: subscription!.id,
      });

      expect(fetched.id).toBe(subscription!.id);
      expect(fetched.webhookId).toBe(bearer.id);
      expect(fetched.event).toBe("PROMPT_VERSION_CREATED");
    });

    it("deletes the subscription; a later get throws NotFoundError", async () => {
      const subscriptionId = subscription!.id;

      await deleteWebhookSubscription({ client, subscriptionId });
      subscription = undefined;

      await expect(
        getWebhookSubscription({ client, subscriptionId }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  // ── Delete ─────────────────────────────────────────────────────────

  describe("deleteWebhook", () => {
    it("deletes by ID; a later get throws NotFoundError", async () => {
      await deleteWebhook({ client, webhook: bearer.id });

      await expect(getWebhook({ client, webhook: bearer.id })).rejects.toThrow(
        NotFoundError,
      );
    });

    it("deletes by name; a later get throws NotFoundError", async () => {
      await deleteWebhook({
        client,
        webhook: hmacName,
        organization: organization.id,
      });

      await expect(getWebhook({ client, webhook: hmac.id })).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
