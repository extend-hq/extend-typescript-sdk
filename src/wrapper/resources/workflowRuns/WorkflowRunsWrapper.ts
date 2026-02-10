/**
 * Extended WorkflowRuns client with polling utilities.
 *
 * @example
 * ```typescript
 * import { ExtendClient } from "extend-ai";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * // Create and poll until completion
 * const result = await client.workflowRuns.createAndPoll({
 *   file: { url: "https://example.com/document.pdf" },
 *   workflow: { id: "workflow_abc123" },
 * });
 *
 * if (result.status === "PROCESSED") {
 *   console.log(result.stepRuns);
 * }
 * ```
 */

import { WorkflowRunsClient as GeneratedWorkflowRunsClient } from "../../../api/resources/workflowRuns/client/Client";
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
  requestOptions?: GeneratedWorkflowRunsClient.RequestOptions;
}

/**
 * Check if a WorkflowRunStatus is terminal (no longer processing).
 * We check for non-terminal states rather than terminal states so that
 * if new terminal states are added, polling will still complete.
 *
 * Non-terminal states: PENDING, PROCESSING, CANCELLING
 * Terminal states: PROCESSED, FAILED, CANCELLED, NEEDS_REVIEW, REJECTED
 */
function isTerminalStatus(status: Extend.WorkflowRunStatus): boolean {
  return (
    status !== "PROCESSING" && status !== "PENDING" && status !== "CANCELLING"
  );
}

export class WorkflowRunsClient extends GeneratedWorkflowRunsClient {
  /**
   * Creates a workflow run and polls until it reaches a terminal state.
   *
   * This is a convenience method that combines `create()` and polling via
   * `retrieve()` with exponential backoff and jitter.
   *
   * Terminal states: PROCESSED, FAILED, CANCELLED, NEEDS_REVIEW, REJECTED
   *
   * @param request - The workflow run creation request
   * @param options - Polling and request options
   * @returns The final workflow run when processing is complete
   * @throws {PollingTimeoutError} If maxWaitMs is set and exceeded
   *
   * @example
   * ```typescript
   * const result = await client.workflowRuns.createAndPoll({
   *   file: { url: "https://example.com/doc.pdf" },
   *   workflow: { id: "workflow_abc123" },
   * });
   *
   * switch (result.status) {
   *   case "PROCESSED":
   *     console.log("Success:", result.stepRuns);
   *     break;
   *   case "NEEDS_REVIEW":
   *     console.log("Needs review:", result.dashboardUrl);
   *     break;
   *   case "FAILED":
   *     console.log("Failed:", result.failureMessage);
   *     break;
   * }
   * ```
   */
  public async createAndPoll(
    request: Extend.WorkflowRunsCreateRequest,
    options: CreateAndPollOptions = {}
  ): Promise<Extend.WorkflowRun> {
    const {
      maxWaitMs,
      initialDelayMs,
      maxDelayMs,
      jitterFraction,
      requestOptions,
    } = options;

    // Create the workflow run
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
