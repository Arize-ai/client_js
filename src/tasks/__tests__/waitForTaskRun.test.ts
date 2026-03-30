import { afterEach, describe, expect, it, vi } from "vitest";
import * as internalModule from "../internal";
import { makeRun } from "./fixtures";
import { waitForTaskRun } from "../waitForTaskRun";

// A no-op client: fetchTaskRun is always mocked, so this is never called.
const fakeClient = {} as never;

describe("waitForTaskRun", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("returns immediately when the run is already completed", async () => {
    vi.spyOn(internalModule, "fetchTaskRun").mockResolvedValue(
      makeRun({ status: "completed" }),
    );

    const result = await waitForTaskRun({
      client: fakeClient,
      runId: "run-1",
      pollInterval: 1,
    });

    expect(result.status).toBe("completed");
    expect(internalModule.fetchTaskRun).toHaveBeenCalledTimes(1);
    expect(internalModule.fetchTaskRun).toHaveBeenCalledWith(
      fakeClient,
      "run-1",
    );
  });

  it("returns when the run is failed", async () => {
    vi.spyOn(internalModule, "fetchTaskRun").mockResolvedValue(
      makeRun({ status: "failed" }),
    );

    const result = await waitForTaskRun({
      client: fakeClient,
      runId: "run-1",
      pollInterval: 1,
    });
    expect(result.status).toBe("failed");
  });

  it("returns when the run is cancelled", async () => {
    vi.spyOn(internalModule, "fetchTaskRun").mockResolvedValue(
      makeRun({ status: "cancelled" }),
    );

    const result = await waitForTaskRun({
      client: fakeClient,
      runId: "run-1",
      pollInterval: 1,
    });
    expect(result.status).toBe("cancelled");
  });

  it("polls until the run reaches a terminal status", async () => {
    vi.useFakeTimers();
    const core = vi
      .spyOn(internalModule, "fetchTaskRun")
      .mockResolvedValueOnce(makeRun({ status: "pending" }))
      .mockResolvedValueOnce(makeRun({ status: "running" }))
      .mockResolvedValueOnce(makeRun({ status: "completed" }));

    const promise = waitForTaskRun({
      client: fakeClient,
      runId: "run-1",
      pollInterval: 10,
    });
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.status).toBe("completed");
    expect(core).toHaveBeenCalledTimes(3);
  });

  it("throws a validation error when timeout is not positive", async () => {
    await expect(
      waitForTaskRun({ client: fakeClient, runId: "run-1", timeout: 0 }),
    ).rejects.toThrow(/timeout must be positive/);

    await expect(
      waitForTaskRun({ client: fakeClient, runId: "run-1", timeout: -1 }),
    ).rejects.toThrow(/timeout must be positive/);
  });

  it("throws a validation error when pollInterval is not positive", async () => {
    await expect(
      waitForTaskRun({ client: fakeClient, runId: "run-1", pollInterval: 0 }),
    ).rejects.toThrow(/pollInterval must be positive/);

    await expect(
      waitForTaskRun({ client: fakeClient, runId: "run-1", pollInterval: -1 }),
    ).rejects.toThrow(/pollInterval must be positive/);
  });

  it("throws when the timeout is exceeded", async () => {
    vi.useFakeTimers();
    vi.spyOn(internalModule, "fetchTaskRun").mockResolvedValue(
      makeRun({ status: "running" }),
    );

    // Attach the rejection handler before advancing timers to avoid an
    // unhandled-rejection warning between the throw and the assertion.
    const assertion = expect(
      waitForTaskRun({
        client: fakeClient,
        runId: "run-1",
        pollInterval: 10,
        timeout: 100,
      }),
    ).rejects.toThrow(/timed out/);
    await vi.runAllTimersAsync();
    await assertion;
  });

  it("passes the client through to the HTTP layer", async () => {
    const core = vi
      .spyOn(internalModule, "fetchTaskRun")
      .mockResolvedValue(makeRun({ status: "completed" }));

    const client = {} as never;
    await waitForTaskRun({
      client,
      runId: "run-1",
      pollInterval: 1,
    });

    expect(core).toHaveBeenCalledWith(client, "run-1");
  });
});
