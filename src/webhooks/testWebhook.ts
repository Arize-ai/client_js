import { createClient } from "../client";
import { TestWebhookResponse, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findWebhookId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformTestWebhookResponse } from "./utils";

export type TestWebhookParams = WithClient<{
  /** The webhook ID or name. When a name is given, `organization` is required. */
  webhook: string;
  /** Organization ID or name. Required when `webhook` is a name. */
  organization?: string;
}>;

/**
 * Send a test event to a webhook's endpoint and report the outcome.
 *
 * A resolved promise means the test ran; check `statusCode` and
 * `errorMessage` for the endpoint's outcome. `statusCode` is 502 when no
 * response was received. Test deliveries are not supported for `HMAC_SHA256`
 * webhooks and are rejected with a 400.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param webhook - The webhook ID or name.
 * @param organization - An optional organization ID or name. Required when `webhook` is a name.
 * @returns A {@link TestWebhookResponse}.
 * @throws Error if the test could not be sent or the response is invalid.
 * @example
 * ```typescript
 * import { testWebhook } from "@arizeai/ax-client"
 *
 * const outcome = await testWebhook({ webhook: "deploy-notifier", organization: "my-org" });
 * console.log(outcome.statusCode, outcome.errorMessage);
 * ```
 */
export async function testWebhook({
  client: clientInstance,
  webhook,
  organization,
}: TestWebhookParams): Promise<TestWebhookResponse> {
  warnPreRelease({ functionName: "testWebhook", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const webhookId = await findWebhookId(client, webhook, organization);
  const response = await client.POST("/v2/webhooks/{webhook_id}/test", {
    params: {
      path: {
        webhook_id: webhookId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformTestWebhookResponse(response.data);
}
