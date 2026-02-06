/**
 * Extended SplitRuns client with polling utilities.
 *
 * @example
 * ```typescript
 * import { ExtendClient } from "extend-ai";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * // Create and poll until completion
 * const result = await client.splitRuns.createAndPoll({
 *   file: { url: "https://example.com/document.pdf" },
 *   splitter: { id: "splitter_abc123" },
 * });
 *
 * if (result.status === "PROCESSED") {
 *   console.log(result.output);
 * }
 * ```
 */

import { SplitRunsClient } from "../../../api/resources/splitRuns/client/Client";
import * as Extend from "../../../api";
import {
  pollUntilDone,
  PollingOptions,
  PollingTimeoutError,
} from "../../utilities/polling";

export { PollingTimeoutError };

export interface CreateAndPollOptions extends PollingOptions {
  /**
   * Request options passed to both create and retrieve calls.
   */
  requestOptions?: SplitRunsClient.RequestOptions;
}

/**
 * Check if a ProcessorRunStatus is terminal (no longer processing).
 * We check for non-terminal states rather than terminal states so that
 * if new terminal states are added, polling will still complete.
 */
function isTerminalStatus(status: Extend.ProcessorRunStatus): boolean {
  return (
    status !== "PROCESSING" && status !== "PENDING" && status !== "CANCELLING"
  );
}

export class SplitRunsWrapper extends SplitRunsClient {
  /**
   * Creates a split run and polls until it reaches a terminal state.
   *
   * This is a convenience method that combines `create()` and polling via
   * `retrieve()` with exponential backoff and jitter.
   *
   * Terminal states: PROCESSED, FAILED, CANCELLED
   *
   * @param request - The split run creation request
   * @param options - Polling and request options
   * @returns The final split run when processing is complete
   * @throws {PollingTimeoutError} If the run doesn't complete within maxWaitMs
   *
   * @example
   * ```typescript
   * const result = await client.splitRuns.createAndPoll({
   *   file: { url: "https://example.com/doc.pdf" },
   *   splitter: { id: "splitter_abc123" },
   * });
   *
   * if (result.status === "PROCESSED") {
   *   console.log(result.output);
   * }
   * ```
   */
  public async createAndPoll(
    request: Extend.SplitRunsCreateRequest,
    options: CreateAndPollOptions = {}
  ): Promise<Extend.SplitRun> {
    const {
      maxWaitMs,
      initialDelayMs,
      maxDelayMs,
      jitterFraction,
      requestOptions,
    } = options;

    // Create the split run
    const createResponse = await this.create(request, requestOptions);
    const runId = createResponse.id;

    // Poll until terminal state
    return pollUntilDone(
      () => this.retrieve(runId, requestOptions),
      (response) => isTerminalStatus(response.status),
      { maxWaitMs, initialDelayMs, maxDelayMs, jitterFraction }
    );
  }
}
