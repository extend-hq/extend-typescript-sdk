/**
 * Polling utilities with exponential backoff and proportional jitter.
 *
 * @example
 * ```typescript
 * const result = await pollUntilDone(
 *   () => client.extractRuns.retrieve(id),
 *   (res) => res.extractRun.status !== "PROCESSING",
 *   { maxWaitMs: 60000 }
 * );
 * ```
 */

export interface PollingOptions {
    /**
     * Maximum total wait time in milliseconds.
     * @default 300000 (5 minutes)
     *
   * Note: Workflow runs can take significantly longer.
   * Consider increasing this value for workflow runs.
     */
    maxWaitMs?: number;

    /**
     * Initial delay between polls in milliseconds.
     * @default 1000 (1 second)
     *
   * 1 second provides a good balance between responsiveness and efficiency.
     */
    initialDelayMs?: number;

    /**
     * Maximum delay between polls in milliseconds.
     * @default 30000 (30 seconds)
     */
    maxDelayMs?: number;

    /**
     * Jitter fraction for randomization. A value of 0.25 means delays
     * will be randomized by +/-25%.
     * @default 0.25
     */
    jitterFraction?: number;
}

/**
 * Error thrown when polling exceeds the maximum wait time.
 */
export class PollingTimeoutError extends Error {
    constructor(
        message: string,
        public readonly elapsedMs: number,
        public readonly maxWaitMs: number,
    ) {
        super(message);
        this.name = "PollingTimeoutError";
    }
}

/**
 * Calculates the next delay using exponential backoff with proportional jitter.
 *
 * @param attempt - The current attempt number (0-indexed)
 * @param initialDelayMs - The base delay for the first attempt
 * @param maxDelayMs - The maximum delay cap
 * @param jitterFraction - The fraction of delay to randomize (+/-)
 * @returns The delay in milliseconds
 */
export function calculateBackoffDelay(
    attempt: number,
    initialDelayMs: number,
    maxDelayMs: number,
    jitterFraction: number,
): number {
    // Exponential backoff: initialDelay * 2^attempt
    const exponentialDelay = initialDelayMs * Math.pow(2, attempt);

    // Cap at maxDelay
    const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

    // Apply proportional jitter: delay * (1 + random(-jitterFraction, +jitterFraction))
    const jitter = (Math.random() * 2 - 1) * jitterFraction;
    const finalDelay = cappedDelay * (1 + jitter);

    return Math.round(finalDelay);
}

/**
 * Polls a retrieve function until a terminal condition is met.
 *
 * Uses exponential backoff with proportional jitter to avoid thundering herd
 * problems and reduce load on the server.
 *
 * @param retrieve - Async function that fetches the current state
 * @param isTerminal - Predicate that returns true when polling should stop
 * @param options - Polling configuration options
 * @returns The final result when isTerminal returns true
 * @throws {PollingTimeoutError} If maxWaitMs is exceeded
 *
 * @example
 * ```typescript
 * const result = await pollUntilDone(
 *   () => client.extractRuns.retrieve(runId),
 *   (res) => res.extractRun.status !== "PROCESSING",
 *   { maxWaitMs: 60000, initialDelayMs: 1000 }
 * );
 * ```
 */
export async function pollUntilDone<T>(
    retrieve: () => Promise<T>,
    isTerminal: (result: T) => boolean,
    options: PollingOptions = {},
): Promise<T> {
    const { maxWaitMs = 300000, initialDelayMs = 1000, maxDelayMs = 30000, jitterFraction = 0.25 } = options;

    const startTime = Date.now();
    let attempt = 0;

    while (true) {
        const result = await retrieve();

        if (isTerminal(result)) {
            return result;
        }

        const elapsedMs = Date.now() - startTime;

        if (elapsedMs >= maxWaitMs) {
            throw new PollingTimeoutError(
                `Polling timed out after ${elapsedMs}ms (max: ${maxWaitMs}ms)`,
                elapsedMs,
                maxWaitMs,
            );
        }

        const delay = calculateBackoffDelay(attempt, initialDelayMs, maxDelayMs, jitterFraction);

        // Don't wait longer than the remaining time
        const remainingMs = maxWaitMs - elapsedMs;
        const actualDelay = Math.min(delay, remainingMs);

        await sleep(actualDelay);
        attempt++;
    }
}

/**
 * Sleep for the specified duration.
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
