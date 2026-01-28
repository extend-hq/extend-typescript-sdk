/**
 * Extended ClassifyRuns client with polling utilities.
 *
 * @example
 * ```typescript
 * import { ExtendClient } from "extend-ai";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * // Create and poll until completion
 * const result = await client.classifyRuns.createAndPoll({
 *   file: { url: "https://example.com/document.pdf" },
 *   classifier: { id: "classifier_abc123" },
 * });
 *
 * if (result.classifyRun.status === "PROCESSED") {
 *   console.log(result.classifyRun.output);
 * }
 * ```
 */

import { ClassifyRuns } from "../../../api/resources/classifyRuns/client/Client";
import * as Extend from "../../../api";
import { pollUntilDone, PollingOptions, PollingTimeoutError } from "../../utilities/polling";

export { PollingTimeoutError };

export interface CreateAndPollOptions extends PollingOptions {
    /**
     * Request options passed to both create and retrieve calls.
     */
    requestOptions?: ClassifyRuns.RequestOptions;
}

/**
 * Check if a ProcessorRunStatus is terminal (no longer processing).
 * We check for non-terminal states rather than terminal states so that
 * if new terminal states are added, polling will still complete.
 */
function isTerminalStatus(status: Extend.ProcessorRunStatus): boolean {
    // @ts-expect-error PENDING and CANCELLING statuses may not exist in the API yet but we want to be future-proof
    return status !== "PROCESSING" && status !== "PENDING" && status !== "CANCELLING";
}

export class ClassifyRunsWrapper extends ClassifyRuns {
    /**
     * Creates a classify run and polls until it reaches a terminal state.
     *
     * This is a convenience method that combines `create()` and polling via
     * `retrieve()` with exponential backoff and jitter.
     *
     * Terminal states: PROCESSED, FAILED, CANCELLED
     *
     * @param request - The classify run creation request
     * @param options - Polling and request options
     * @returns The final classify run response when processing is complete
     * @throws {PollingTimeoutError} If the run doesn't complete within maxWaitMs
     *
     * @example
     * ```typescript
     * const result = await client.classifyRuns.createAndPoll({
     *   file: { url: "https://example.com/doc.pdf" },
     *   classifier: { id: "classifier_abc123" },
     * });
     *
     * if (result.classifyRun.status === "PROCESSED") {
     *   console.log(result.classifyRun.output);
     * }
     * ```
     */
    public async createAndPoll(
        request: Extend.ClassifyRunsCreateRequest,
        options: CreateAndPollOptions = {},
    ): Promise<Extend.ClassifyRunsRetrieveResponse> {
        const { maxWaitMs, initialDelayMs, maxDelayMs, jitterFraction, requestOptions } = options;

        // Create the classify run
        const createResponse = await this.create(request, requestOptions);
        const runId = createResponse.classifyRun.id;

        // Poll until terminal state
        return pollUntilDone(
            () => this.retrieve(runId, requestOptions),
            (response) => isTerminalStatus(response.classifyRun.status),
            { maxWaitMs, initialDelayMs, maxDelayMs, jitterFraction },
        );
    }
}
