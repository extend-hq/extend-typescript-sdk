/**
 * Extended EditRuns client with polling utilities.
 *
 * @example
 * ```typescript
 * import { ExtendClient } from "extend-ai";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * // Create and poll until completion
 * const result = await client.editRuns.createAndPoll({
 *   file: { url: "https://example.com/document.pdf" },
 *   config: {
 *     schema: { ... },
 *     instructions: "Fill in the form fields",
 *   },
 * });
 *
 * if (result.editRun.status === "PROCESSED") {
 *   console.log(result.editRun.output);
 * }
 * ```
 */

import { EditRuns } from "../../../api/resources/editRuns/client/Client";
import * as Extend from "../../../api";
import { pollUntilDone, PollingOptions, PollingTimeoutError } from "../../utilities/polling";
import { EditRunFailedError } from "../../errors";

export { PollingTimeoutError };

export interface CreateAndPollOptions extends PollingOptions {
    /**
     * Request options passed to both create and retrieve calls.
     */
    requestOptions?: EditRuns.RequestOptions;
}

/**
 * Check if an EditRunStatus is terminal (no longer processing).
 * We check for non-terminal states rather than terminal states so that
 * if new terminal states are added, polling will still complete.
 */
function isTerminalStatus(status: Extend.EditRunStatus): boolean {
    // @ts-expect-error PENDING and CANCELLING statuses may not exist in the API yet but we want to be future-proof
    return status !== "PROCESSING" && status !== "PENDING" && status !== "CANCELLING";
}

export class EditRunsWrapper extends EditRuns {
    /**
     * Creates an edit run and polls until it reaches a terminal state.
     *
     * This is a convenience method that combines `create()` and polling via
     * `retrieve()` with exponential backoff and jitter.
     *
     * Terminal states: PROCESSED, FAILED
     *
     * @param request - The edit run creation request
     * @param options - Polling and request options
     * @param options.throwOnFailure - If true, throws EditRunFailedError on FAILED status
     * @returns The final edit run response when processing is complete
     * @throws {PollingTimeoutError} If the run doesn't complete within maxWaitMs
     * @throws {EditRunFailedError} If throwOnFailure is true and status is FAILED
     *
     * @example
     * ```typescript
     * const result = await client.editRuns.createAndPoll({
     *   file: { url: "https://example.com/form.pdf" },
     *   config: {
     *     schema: { fields: [...] },
     *     instructions: "Fill in the form fields",
     *   },
     * });
     *
     * if (result.editRun.status === "PROCESSED") {
     *   console.log(result.editRun.output);
     * }
     * ```
     *
     * @example
     * ```typescript
     * try {
     *   const result = await client.editRuns.createAndPoll(
     *     { file: { url: "https://example.com/form.pdf" }, config: { schema: {}, instructions: "Fill in" } },
     *     { throwOnFailure: true },
     *   );
     *   console.log(result.editRun.output);
     * } catch (error) {
     *   if (error instanceof EditRunFailedError) {
     *     console.log(error.failureReason);
     *   }
     * }
     * ```
     */
    public async createAndPoll(
        request: Extend.EditRunsCreateRequest,
        options: CreateAndPollOptions = {},
    ): Promise<Extend.EditRunsRetrieveResponse> {
        const { requestOptions, throwOnFailure, ...pollingOptions } = options;

        // Create the edit run
        const createResponse = await this.create(request, requestOptions);
        const runId = createResponse.editRun.id;

        // Poll until terminal state
        const result = await pollUntilDone(
            () => this.retrieve(runId, requestOptions),
            (response) => isTerminalStatus(response.editRun.status),
            pollingOptions,
        );

        if (throwOnFailure && result.editRun.status === "FAILED") {
            throw new EditRunFailedError(result);
        }

        return result;
    }
}
