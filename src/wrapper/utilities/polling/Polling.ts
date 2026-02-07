/**
 * Polling utilities with hybrid polling strategy: fast initial polls followed
 * by exponential backoff with proportional jitter.
 *
 * The default strategy polls at 1-second intervals for the first 30 seconds,
 * then gradually increases the interval using exponential backoff (1.15x multiplier)
 * up to a maximum of 30 seconds between polls.
 *
 * @example
 * ```typescript
 * // Polls until complete (uses hybrid strategy by default)
 * const result = await pollUntilDone(
 *   () => client.extractRuns.retrieve(id),
 *   (res) => res.extractRun.status !== "PROCESSING"
 * );
 *
 * // With custom timeout
 * const result = await pollUntilDone(
 *   () => client.extractRuns.retrieve(id),
 *   (res) => res.extractRun.status !== "PROCESSING",
 *   { maxWaitMs: 300000 } // 5 minute timeout
 * );
 *
 * // Custom fast polling phase
 * const result = await pollUntilDone(
 *   () => client.extractRuns.retrieve(id),
 *   (res) => res.extractRun.status !== "PROCESSING",
 *   {
 *     fastPollDurationMs: 60000,  // Fast poll for 60 seconds
 *     fastPollIntervalMs: 500,    // Poll every 500ms during fast phase
 *   }
 * );
 * ```
 */

export interface PollingOptions {
    /**
     * Maximum total wait time in milliseconds.
     * @default undefined (polls indefinitely)
     */
    maxWaitMs?: number;

    /**
     * Duration of the fast polling phase in milliseconds.
     * During this phase, polls occur at a fixed interval (fastPollIntervalMs).
     * @default 30000 (30 seconds)
     */
    fastPollDurationMs?: number;

    /**
     * Interval between polls during the fast polling phase in milliseconds.
     * @default 1000 (1 second)
     */
    fastPollIntervalMs?: number;

    /**
     * Initial delay for the backoff phase (after fast polling ends) in milliseconds.
     * @default 1000 (1 second)
     */
    initialDelayMs?: number;

    /**
     * Maximum delay between polls in milliseconds.
     * @default 30000 (30 seconds)
     */
    maxDelayMs?: number;

    /**
     * Multiplier for exponential backoff during the backoff phase.
     * A value of 1.15 means each delay is 1.15x the previous delay.
     * @default 1.15
     */
    backoffMultiplier?: number;

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
 * @param backoffMultiplier - The multiplier for exponential backoff (default: 2)
 * @returns The delay in milliseconds
 */
export function calculateBackoffDelay(
    attempt: number,
    initialDelayMs: number,
    maxDelayMs: number,
    jitterFraction: number,
    backoffMultiplier: number = 2,
): number {
    // Exponential backoff: initialDelay * multiplier^attempt
    const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt);

    // Cap at maxDelay
    const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

    // Apply proportional jitter: delay * (1 + random(-jitterFraction, +jitterFraction))
    const jitter = (Math.random() * 2 - 1) * jitterFraction;
    const finalDelay = cappedDelay * (1 + jitter);

    return Math.round(finalDelay);
}

/**
 * Configuration options for calculating hybrid delay.
 */
export interface HybridDelayOptions {
    /** Duration of fast polling phase in milliseconds */
    fastPollDurationMs: number;
    /** Interval between polls during fast phase in milliseconds */
    fastPollIntervalMs: number;
    /** Initial delay for backoff phase in milliseconds */
    initialDelayMs: number;
    /** Maximum delay cap in milliseconds */
    maxDelayMs: number;
    /** Multiplier for exponential backoff */
    backoffMultiplier: number;
    /** Jitter fraction for randomization */
    jitterFraction: number;
}

/**
 * Calculates the delay for a hybrid polling strategy based on elapsed time.
 *
 * During the fast polling phase (elapsed < fastPollDurationMs), returns a fixed
 * interval with jitter. After the fast phase ends, switches to exponential backoff.
 *
 * @param elapsedMs - Total elapsed time since polling started
 * @param options - Configuration options for the hybrid strategy
 * @returns The delay in milliseconds until the next poll
 */
export function calculateHybridDelay(elapsedMs: number, options: HybridDelayOptions): number {
    const { fastPollDurationMs, fastPollIntervalMs, initialDelayMs, maxDelayMs, backoffMultiplier, jitterFraction } =
        options;

    // Fast polling phase: use fixed interval with jitter
    if (elapsedMs < fastPollDurationMs) {
        const jitter = (Math.random() * 2 - 1) * jitterFraction;
        return Math.round(fastPollIntervalMs * (1 + jitter));
    }

    // Backoff phase: calculate attempt number based on time since fast phase ended
    // We estimate the attempt number by solving for n in the geometric series sum
    const timeSinceBackoffStart = elapsedMs - fastPollDurationMs;

    // Calculate which "attempt" we're on based on elapsed time in backoff phase
    // Sum of geometric series: S = a * (r^n - 1) / (r - 1)
    // Solving for n: n = log((S * (r - 1) / a) + 1) / log(r)
    let attempt: number;
    if (backoffMultiplier === 1) {
        // Linear case: attempt = timeSinceBackoffStart / initialDelayMs
        attempt = Math.floor(timeSinceBackoffStart / initialDelayMs);
    } else {
        const r = backoffMultiplier;
        const a = initialDelayMs;
        const S = timeSinceBackoffStart;

        // Estimate attempt from geometric series sum formula
        const innerValue = (S * (r - 1)) / a + 1;
        if (innerValue <= 0) {
            attempt = 0;
        } else {
            attempt = Math.floor(Math.log(innerValue) / Math.log(r));
        }
    }

    return calculateBackoffDelay(attempt, initialDelayMs, maxDelayMs, jitterFraction, backoffMultiplier);
}

/**
 * Polls a retrieve function until a terminal condition is met.
 *
 * Uses a hybrid polling strategy: fast polling at fixed intervals for an initial
 * period, then exponential backoff with proportional jitter. This provides low
 * latency for quick operations while still reducing server load for longer ones.
 *
 * Default behavior:
 * - Fast phase: Poll every 1 second for the first 30 seconds
 * - Backoff phase: Exponential backoff with 1.15x multiplier, max 30 second delay
 *
 * By default, polls indefinitely until a terminal state is reached.
 * Use `maxWaitMs` to set an explicit timeout if desired.
 *
 * @param retrieve - Async function that fetches the current state
 * @param isTerminal - Predicate that returns true when polling should stop
 * @param options - Polling configuration options
 * @returns The final result when isTerminal returns true
 * @throws {PollingTimeoutError} If maxWaitMs is set and exceeded
 *
 * @example
 * ```typescript
 * // Polls indefinitely (suitable for development/testing)
 * const result = await pollUntilDone(
 *   () => client.extractRuns.retrieve(runId),
 *   (res) => res.extractRun.status !== "PROCESSING"
 * );
 *
 * // With timeout
 * const result = await pollUntilDone(
 *   () => client.extractRuns.retrieve(runId),
 *   (res) => res.extractRun.status !== "PROCESSING",
 *   { maxWaitMs: 300000 } // 5 minute timeout
 * );
 *
 * // Pure exponential backoff (disable fast polling phase)
 * const result = await pollUntilDone(
 *   () => client.extractRuns.retrieve(runId),
 *   (res) => res.extractRun.status !== "PROCESSING",
 *   { fastPollDurationMs: 0 }
 * );
 * ```
 */
export async function pollUntilDone<T>(
    retrieve: () => Promise<T>,
    isTerminal: (result: T) => boolean,
    options: PollingOptions = {},
): Promise<T> {
    const {
        maxWaitMs,
        fastPollDurationMs = 30000,
        fastPollIntervalMs = 1000,
        initialDelayMs = 1000,
        maxDelayMs = 30000,
        backoffMultiplier = 1.15,
        jitterFraction = 0.25,
    } = options;

    const startTime = Date.now();

    while (true) {
        const result = await retrieve();

        if (isTerminal(result)) {
            return result;
        }

        const elapsedMs = Date.now() - startTime;

        // Only check timeout if maxWaitMs is set
        if (maxWaitMs !== undefined && elapsedMs >= maxWaitMs) {
            throw new PollingTimeoutError(
                `Polling timed out after ${elapsedMs}ms (max: ${maxWaitMs}ms)`,
                elapsedMs,
                maxWaitMs,
            );
        }

        const delay = calculateHybridDelay(elapsedMs, {
            fastPollDurationMs,
            fastPollIntervalMs,
            initialDelayMs,
            maxDelayMs,
            backoffMultiplier,
            jitterFraction,
        });

        // If timeout is set, don't wait longer than remaining time
        const actualDelay = maxWaitMs !== undefined ? Math.min(delay, maxWaitMs - elapsedMs) : delay;

        await sleep(actualDelay);
    }
}

/**
 * Sleep for the specified duration.
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
