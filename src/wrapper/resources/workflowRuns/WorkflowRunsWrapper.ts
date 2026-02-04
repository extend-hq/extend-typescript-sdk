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
 * if (result.workflowRun.status === "PROCESSED") {
 *   console.log(result.workflowRun.stepRuns);
 * }
 * ```
 */

import { WorkflowRuns } from "../../../api/resources/workflowRuns/client/Client";
import * as Extend from "../../../api";
import { pollUntilDone, PollingOptions, PollingTimeoutError } from "../../utilities/polling";
import { WorkflowRunFailedError } from "../../errors";

export { PollingTimeoutError };

export interface CreateAndPollOptions extends PollingOptions {
    /**
     * Request options passed to both create and retrieve calls.
     */
    requestOptions?: WorkflowRuns.RequestOptions;
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
    return status !== "PROCESSING" && status !== "PENDING" && status !== "CANCELLING";
}

export class WorkflowRunsWrapper extends WorkflowRuns {
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
     * @param options.throwOnFailure - If true, throws WorkflowRunFailedError on FAILED status
     * @returns The final workflow run response when processing is complete
     * @throws {PollingTimeoutError} If maxWaitMs is set and exceeded
     * @throws {WorkflowRunFailedError} If throwOnFailure is true and status is FAILED
     *
     * @example
     * ```typescript
     * const result = await client.workflowRuns.createAndPoll({
     *   file: { url: "https://example.com/doc.pdf" },
     *   workflow: { id: "workflow_abc123" },
     * });
     *
     * switch (result.workflowRun.status) {
     *   case "PROCESSED":
     *     console.log("Success:", result.workflowRun.stepRuns);
     *     break;
     *   case "NEEDS_REVIEW":
     *     console.log("Needs review:", result.workflowRun.dashboardUrl);
     *     break;
     *   case "FAILED":
     *     console.log("Failed:", result.workflowRun.failureMessage);
     *     break;
     * }
     * ```
     *
     * @example
     * ```typescript
     * try {
     *   const result = await client.workflowRuns.createAndPoll(
     *     { file: { url: "https://example.com/doc.pdf" }, workflow: { id: "workflow_abc123" } },
     *     { throwOnFailure: true },
     *   );
     *   console.log(result.workflowRun.status);
     * } catch (error) {
     *   if (error instanceof WorkflowRunFailedError) {
     *     console.log(error.failureReason);
     *   }
     * }
     * ```
     */
    public async createAndPoll(
        request: Extend.WorkflowRunsCreateRequest,
        options: CreateAndPollOptions = {},
    ): Promise<Extend.WorkflowRunsRetrieveResponse> {
        const { requestOptions, throwOnFailure, ...pollingOptions } = options;

        // Create the workflow run
        const createResponse = await this.create(request, requestOptions);
        const runId = createResponse.workflowRun.id;

        // Poll until terminal state
        const result = await pollUntilDone(
            () => this.retrieve(runId, requestOptions),
            (response) => isTerminalStatus(response.workflowRun.status),
            pollingOptions,
        );

        if (throwOnFailure && result.workflowRun.status === "FAILED") {
            throw new WorkflowRunFailedError(result);
        }

        return result;
    }
}
