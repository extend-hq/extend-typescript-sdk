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

export { PollingTimeoutError };

/**
 * Default maximum wait time for workflow runs (2 hours).
 * Workflow runs can take significantly longer than other run types.
 */
const DEFAULT_WORKFLOW_MAX_WAIT_MS = 2 * 60 * 60 * 1000;

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
     * Note: Workflow runs can take significantly longer than other run types.
     * The default maxWaitMs is 2 hours. Consider increasing this for complex workflows.
     *
     * @param request - The workflow run creation request
     * @param options - Polling and request options
     * @returns The final workflow run response when processing is complete
     * @throws {PollingTimeoutError} If the run doesn't complete within maxWaitMs
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
     */
    public async createAndPoll(
        request: Extend.WorkflowRunsCreateRequest,
        options: CreateAndPollOptions = {},
    ): Promise<Extend.WorkflowRunsRetrieveResponse> {
        const {
            maxWaitMs = DEFAULT_WORKFLOW_MAX_WAIT_MS,
            initialDelayMs,
            maxDelayMs,
            jitterFraction,
            requestOptions,
        } = options;

        // Create the workflow run
        const createResponse = await this.create(request, requestOptions);
        const runId = createResponse.workflowRun.id;

        // Poll until terminal state
        return pollUntilDone(
            () => this.retrieve(runId, requestOptions),
            (response) => isTerminalStatus(response.workflowRun.status),
            { maxWaitMs, initialDelayMs, maxDelayMs, jitterFraction },
        );
    }
}
