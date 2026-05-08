import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { mockRawAnnotationQueue } from "./fixtures";
import { updateAnnotationQueue } from "../updateAnnotationQueue";

describe("updateAnnotationQueue", () => {
  const patch = vi.fn();

  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockRawAnnotationQueue,
    });
    vi.spyOn(resolveModule, "findAnnotationQueueId").mockResolvedValue(
      "resolved-queue-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls PATCH with name in body", async () => {
    await updateAnnotationQueue({
      client: mockClient,
      annotationQueue: "my-queue",
      name: "Renamed Queue",
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith(
      "/v2/annotation-queues/{annotation_queue_id}",
      {
        params: { path: { annotation_queue_id: "resolved-queue-id" } },
        body: {
          name: "Renamed Queue",
          instructions: undefined,
          annotation_config_ids: undefined,
          annotator_emails: undefined,
        },
      },
    );
  });

  it("passes empty string instructions to clear in request body", async () => {
    await updateAnnotationQueue({
      client: mockClient,
      annotationQueue: "my-queue",
      instructions: "",
    });

    expect(patch).toHaveBeenCalledWith(
      "/v2/annotation-queues/{annotation_queue_id}",
      {
        params: { path: { annotation_queue_id: "resolved-queue-id" } },
        body: {
          name: undefined,
          instructions: "",
          annotation_config_ids: undefined,
          annotator_emails: undefined,
        },
      },
    );
  });

  it("passes string instructions through unchanged", async () => {
    await updateAnnotationQueue({
      client: mockClient,
      annotationQueue: "my-queue",
      instructions: "Review carefully",
    });

    expect(patch).toHaveBeenCalledWith(
      "/v2/annotation-queues/{annotation_queue_id}",
      {
        params: { path: { annotation_queue_id: "resolved-queue-id" } },
        body: {
          name: undefined,
          instructions: "Review carefully",
          annotation_config_ids: undefined,
          annotator_emails: undefined,
        },
      },
    );
  });

  it("omits instructions from body when undefined", async () => {
    await updateAnnotationQueue({
      client: mockClient,
      annotationQueue: "my-queue",
      name: "Renamed",
    });

    expect(patch).toHaveBeenCalledWith(
      "/v2/annotation-queues/{annotation_queue_id}",
      {
        params: { path: { annotation_queue_id: "resolved-queue-id" } },
        body: {
          name: "Renamed",
          instructions: undefined,
          annotation_config_ids: undefined,
          annotator_emails: undefined,
        },
      },
    );
  });

  it("throws when API returns error", async () => {
    patch.mockResolvedValue({
      error: { detail: "not found", title: "Error" },
      data: undefined,
    });

    await expect(
      updateAnnotationQueue({
        client: mockClient,
        annotationQueue: "my-queue",
        name: "x",
      }),
    ).rejects.toThrow("not found");
  });
});
