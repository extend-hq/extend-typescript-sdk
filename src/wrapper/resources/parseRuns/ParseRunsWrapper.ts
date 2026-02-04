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
 * if (result.parseRun.status === "PROCESSED") {
 *   console.log(result.parseRun.output);
 * }
 * ```
 */

import { ParseRuns } from "../../../api/resources/parseRuns/client/Client";
import * as Extend from "../../../api";
import { pollUntilDone, PollingOptions, PollingTimeoutError } from "../../utilities/polling";
import { ParseRunFailedError } from "../../errors";

export { PollingTimeoutError };

export interface CreateAndPollOptions extends PollingOptions {
    /**
     * Request options passed to both create and retrieve calls.
     */
    requestOptions?: ParseRuns.RequestOptions;
}

/**
 * Check if a ParseRunStatusEnum is terminal (no longer processing).
 * We check for non-terminal states rather than terminal states so that
 * if new terminal states are added, polling will still complete.
 */
function isTerminalStatus(status: Extend.ParseRunStatusEnum): boolean {
    // @ts-expect-error PENDING and CANCELLING statuses may not exist in the API yet but we want to be future-proof
    return status !== "PROCESSING" && status !== "PENDING" && status !== "CANCELLING";
}

export class ParseRunsWrapper extends ParseRuns {
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
     * @param options.throwOnFailure - If true, throws ParseRunFailedError on FAILED status
     * @returns The final parse run response when processing is complete
     * @throws {PollingTimeoutError} If the run doesn't complete within maxWaitMs
     * @throws {ParseRunFailedError} If throwOnFailure is true and status is FAILED
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
     * if (result.parseRun.status === "PROCESSED") {
     *   console.log(result.parseRun.output);
     * }
     * ```
     *
     * @example
     * ```typescript
     * try {
     *   const result = await client.parseRuns.createAndPoll(
     *     { file: { url: "https://example.com/doc.pdf" } },
     *     { throwOnFailure: true },
     *   );
     *   console.log(result.parseRun.output);
     * } catch (error) {
     *   if (error instanceof ParseRunFailedError) {
     *     console.log(error.failureReason);
     *   }
     * }
     * ```
     */
    public async createAndPoll(
        request: Extend.ParseRunsCreateRequest,
        options: CreateAndPollOptions = {},
    ): Promise<Extend.ParseRunsRetrieveResponse> {
        const { requestOptions, throwOnFailure, ...pollingOptions } = options;

        // Create the parse run
        const createResponse = await this.create(request, requestOptions);
        const runId = createResponse.parseRun.id;

        // Poll until terminal state
        // Note: parseRuns.retrieve takes an optional request object as the second parameter
        const result = await pollUntilDone(
            () => this.retrieve(runId, {}, requestOptions),
            (response) => isTerminalStatus(response.parseRun.status),
            pollingOptions,
        );

        if (throwOnFailure && result.parseRun.status === "FAILED") {
            throw new ParseRunFailedError(result);
        }

        return result;
    }
}
