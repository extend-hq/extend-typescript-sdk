/**
 * Extended ParseRuns client with polling utilities.
 *
 * @example
 * ```typescript
 * import { ExtendClient } from "extend-ai";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * // Create and poll until completion
 * const result = await client.parseRuns.createAndPoll({
 *   file: { url: "https://example.com/document.pdf" },
 * });
 *
 * if (result.status === "PROCESSED") {
 *   console.log(result.output);
 * }
 * ```
 */

import { ParseRunsClient } from "../../../api/resources/parseRuns/client/Client";
import * as Extend from "../../../api";
import { pollUntilDone, PollingOptions, PollingTimeoutError } from "../../utilities/polling";

export { PollingTimeoutError };

export interface CreateAndPollOptions extends PollingOptions {
    /**
     * Request options passed to both create and retrieve calls.
     */
    requestOptions?: ParseRunsClient.RequestOptions;
}

/**
 * Check if a ParseRunStatusEnum is terminal (no longer processing).
 * We check for non-terminal states rather than terminal states so that
 * if new terminal states are added, polling will still complete.
 */
function isTerminalStatus(status: Extend.ParseRunStatusEnum): boolean {
    return status !== "PROCESSING" && status !== "PENDING" && status !== "CANCELLING";
}

export class ParseRunsWrapper extends ParseRunsClient {
    /**
     * Creates a parse run and polls until it reaches a terminal state.
     *
     * This is a convenience method that combines `create()` and polling via
     * `retrieve()` with exponential backoff and jitter.
     *
     * Terminal states: PROCESSED, FAILED
     *
     * @param request - The parse run creation request
     * @param options - Polling and request options
     * @returns The final parse run when processing is complete
     * @throws {PollingTimeoutError} If the run doesn't complete within maxWaitMs
     *
     * @example
     * ```typescript
     * const result = await client.parseRuns.createAndPoll({
     *   file: { url: "https://example.com/doc.pdf" },
     *   config: {
     *     blockOptions: {
     *       text: { enabled: true },
     *       tables: { enabled: true },
     *     },
     *   },
     * });
     *
     * if (result.status === "PROCESSED") {
     *   console.log(result.output);
     * }
     * ```
     */
    public async createAndPoll(
        request: Extend.ParseRunsCreateRequest,
        options: CreateAndPollOptions = {},
    ): Promise<Extend.ParseRun> {
        const { maxWaitMs, initialDelayMs, maxDelayMs, jitterFraction, requestOptions } = options;

        // Create the parse run
        const createResponse = await this.create(request, requestOptions);
        const runId = createResponse.id;

        // Poll until terminal state
        // Note: parseRuns.retrieve takes an optional request object as the second parameter
        return pollUntilDone(
            () => this.retrieve(runId, {}, requestOptions),
            (response) => isTerminalStatus(response.status),
            { maxWaitMs, initialDelayMs, maxDelayMs, jitterFraction },
        );
    }
}
