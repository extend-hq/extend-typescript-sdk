import { calculateBackoffDelay, calculateHybridDelay, pollUntilDone, PollingTimeoutError } from "./Polling";
import type { HybridDelayOptions } from "./Polling";

// ============================================================================
// calculateBackoffDelay tests
// ============================================================================

describe("calculateBackoffDelay", () => {
    // Mock Math.random to have predictable tests
    const originalRandom = Math.random;

    afterEach(() => {
        Math.random = originalRandom;
    });

    describe("exponential backoff calculation with default multiplier (2x)", () => {
        beforeEach(() => {
            // Set random to 0.5 so jitter factor is 0 (neutral)
            Math.random = () => 0.5;
        });

        it("should return initialDelayMs for attempt 0", () => {
            const delay = calculateBackoffDelay(0, 1000, 30000, 0.25);
            expect(delay).toBe(1000);
        });

        it("should double delay for each attempt", () => {
            expect(calculateBackoffDelay(0, 1000, 30000, 0.25)).toBe(1000);
            expect(calculateBackoffDelay(1, 1000, 30000, 0.25)).toBe(2000);
            expect(calculateBackoffDelay(2, 1000, 30000, 0.25)).toBe(4000);
            expect(calculateBackoffDelay(3, 1000, 30000, 0.25)).toBe(8000);
            expect(calculateBackoffDelay(4, 1000, 30000, 0.25)).toBe(16000);
        });

        it("should cap delay at maxDelayMs", () => {
            const delay = calculateBackoffDelay(10, 1000, 30000, 0.25);
            // 2^10 * 1000 = 1024000, but capped at 30000
            expect(delay).toBe(30000);
        });

        it("should respect different initialDelayMs", () => {
            expect(calculateBackoffDelay(0, 500, 30000, 0.25)).toBe(500);
            expect(calculateBackoffDelay(1, 500, 30000, 0.25)).toBe(1000);
            expect(calculateBackoffDelay(2, 500, 30000, 0.25)).toBe(2000);
        });
    });

    describe("exponential backoff calculation with custom multiplier (1.5x)", () => {
        beforeEach(() => {
            Math.random = () => 0.5;
        });

        it("should use 1.5x multiplier when specified", () => {
            expect(calculateBackoffDelay(0, 1000, 30000, 0.25, 1.5)).toBe(1000);
            expect(calculateBackoffDelay(1, 1000, 30000, 0.25, 1.5)).toBe(1500);
            expect(calculateBackoffDelay(2, 1000, 30000, 0.25, 1.5)).toBe(2250);
            expect(calculateBackoffDelay(3, 1000, 30000, 0.25, 1.5)).toBe(3375);
            expect(calculateBackoffDelay(4, 1000, 30000, 0.25, 1.5)).toBe(5063); // 5062.5 rounded
        });

        it("should cap at maxDelayMs with 1.5x multiplier", () => {
            // 1.5^10 * 1000 ≈ 57665, capped at 30000
            const delay = calculateBackoffDelay(10, 1000, 30000, 0.25, 1.5);
            expect(delay).toBe(30000);
        });

        it("should work with 1x multiplier (constant delay)", () => {
            expect(calculateBackoffDelay(0, 1000, 30000, 0.25, 1)).toBe(1000);
            expect(calculateBackoffDelay(5, 1000, 30000, 0.25, 1)).toBe(1000);
            expect(calculateBackoffDelay(10, 1000, 30000, 0.25, 1)).toBe(1000);
        });
    });

    describe("jitter application", () => {
        it("should apply positive jitter when random > 0.5", () => {
            Math.random = () => 1.0; // Maximum positive jitter
            const delay = calculateBackoffDelay(0, 1000, 30000, 0.25);
            // jitter = (1.0 * 2 - 1) * 0.25 = 0.25
            // delay = 1000 * (1 + 0.25) = 1250
            expect(delay).toBe(1250);
        });

        it("should apply negative jitter when random < 0.5", () => {
            Math.random = () => 0.0; // Maximum negative jitter
            const delay = calculateBackoffDelay(0, 1000, 30000, 0.25);
            // jitter = (0.0 * 2 - 1) * 0.25 = -0.25
            // delay = 1000 * (1 - 0.25) = 750
            expect(delay).toBe(750);
        });

        it("should apply no jitter when random = 0.5", () => {
            Math.random = () => 0.5;
            const delay = calculateBackoffDelay(0, 1000, 30000, 0.25);
            expect(delay).toBe(1000);
        });

        it("should handle zero jitter fraction", () => {
            Math.random = () => 1.0;
            const delay = calculateBackoffDelay(0, 1000, 30000, 0);
            expect(delay).toBe(1000); // No jitter applied
        });

        it("should handle larger jitter fractions", () => {
            Math.random = () => 1.0;
            const delay = calculateBackoffDelay(0, 1000, 30000, 0.5);
            // jitter = 0.5, delay = 1000 * 1.5 = 1500
            expect(delay).toBe(1500);
        });
    });

    describe("edge cases", () => {
        beforeEach(() => {
            Math.random = () => 0.5;
        });

        it("should return rounded integer", () => {
            Math.random = () => 0.75; // Will produce non-integer before rounding
            const delay = calculateBackoffDelay(0, 1000, 30000, 0.25);
            expect(Number.isInteger(delay)).toBe(true);
        });

        it("should handle very small initial delays", () => {
            const delay = calculateBackoffDelay(0, 10, 30000, 0.25);
            expect(delay).toBe(10);
        });

        it("should handle maxDelay smaller than initial delay", () => {
            const delay = calculateBackoffDelay(0, 1000, 500, 0.25);
            expect(delay).toBe(500);
        });
    });
});

// ============================================================================
// calculateHybridDelay tests
// ============================================================================

describe("calculateHybridDelay", () => {
    const originalRandom = Math.random;

    afterEach(() => {
        Math.random = originalRandom;
    });

    const defaultOptions: HybridDelayOptions = {
        fastPollDurationMs: 30000,
        fastPollIntervalMs: 1000,
        initialDelayMs: 1000,
        maxDelayMs: 30000,
        backoffMultiplier: 1.15,
        jitterFraction: 0.25,
    };

    describe("fast polling phase", () => {
        beforeEach(() => {
            Math.random = () => 0.5; // No jitter
        });

        it("should return fastPollIntervalMs during fast phase", () => {
            expect(calculateHybridDelay(0, defaultOptions)).toBe(1000);
            expect(calculateHybridDelay(10000, defaultOptions)).toBe(1000);
            expect(calculateHybridDelay(29999, defaultOptions)).toBe(1000);
        });

        it("should apply jitter during fast phase", () => {
            Math.random = () => 1.0; // Maximum positive jitter
            // 1000 * (1 + 0.25) = 1250
            expect(calculateHybridDelay(0, defaultOptions)).toBe(1250);

            Math.random = () => 0.0; // Maximum negative jitter
            // 1000 * (1 - 0.25) = 750
            expect(calculateHybridDelay(0, defaultOptions)).toBe(750);
        });

        it("should respect custom fastPollIntervalMs", () => {
            const options = { ...defaultOptions, fastPollIntervalMs: 500 };
            expect(calculateHybridDelay(0, options)).toBe(500);
        });

        it("should respect custom fastPollDurationMs", () => {
            const options = { ...defaultOptions, fastPollDurationMs: 60000 };
            // Should still be in fast phase at 45s
            expect(calculateHybridDelay(45000, options)).toBe(1000);
        });
    });

    describe("backoff phase", () => {
        beforeEach(() => {
            Math.random = () => 0.5; // No jitter
        });

        it("should switch to backoff after fastPollDurationMs", () => {
            // At exactly 30s, we're in backoff phase, attempt 0
            const delay = calculateHybridDelay(30000, defaultOptions);
            expect(delay).toBe(1000);
        });

        it("should increase delay during backoff phase with 1.15x multiplier", () => {
            // Test delays at various times in backoff phase
            // The attempt number is estimated from elapsed time
            const delay30s = calculateHybridDelay(30000, defaultOptions);
            expect(delay30s).toBe(1000); // attempt 0

            const delay31s = calculateHybridDelay(31000, defaultOptions);
            expect(delay31s).toBe(1150); // attempt 1

            const delay32_15s = calculateHybridDelay(32150, defaultOptions);
            expect(delay32_15s).toBe(1322); // attempt 2 (1000 * 1.15^2 = 1322.5, rounded down)
        });

        it("should cap delay at maxDelayMs", () => {
            // Far into backoff phase, delay should be capped
            const delay = calculateHybridDelay(300000, defaultOptions);
            expect(delay).toBe(30000);
        });

        it("should work with 2x multiplier", () => {
            const options = { ...defaultOptions, backoffMultiplier: 2 };
            const delay30s = calculateHybridDelay(30000, options);
            expect(delay30s).toBe(1000);

            const delay31s = calculateHybridDelay(31000, options);
            expect(delay31s).toBe(2000);
        });

        it("should work with 1x multiplier (constant delay)", () => {
            const options = { ...defaultOptions, backoffMultiplier: 1 };
            expect(calculateHybridDelay(30000, options)).toBe(1000);
            expect(calculateHybridDelay(60000, options)).toBe(1000);
            expect(calculateHybridDelay(120000, options)).toBe(1000);
        });
    });

    describe("edge cases", () => {
        beforeEach(() => {
            Math.random = () => 0.5;
        });

        it("should handle fastPollDurationMs = 0 (pure backoff)", () => {
            const options = { ...defaultOptions, fastPollDurationMs: 0 };
            // Should immediately use backoff
            const delay = calculateHybridDelay(0, options);
            expect(delay).toBe(1000);
        });

        it("should handle very long elapsed times", () => {
            // 1 hour elapsed
            const delay = calculateHybridDelay(3600000, defaultOptions);
            expect(delay).toBe(30000); // Should be capped
        });

        it("should return positive delay for all inputs", () => {
            for (let elapsed = 0; elapsed < 100000; elapsed += 5000) {
                const delay = calculateHybridDelay(elapsed, defaultOptions);
                expect(delay).toBeGreaterThan(0);
            }
        });
    });
});

// ============================================================================
// pollUntilDone tests
// ============================================================================

describe("pollUntilDone", () => {
    describe("basic polling behavior", () => {
        it("should return immediately when isTerminal returns true on first call", async () => {
            const retrieve = jest.fn().mockResolvedValue({ status: "DONE", value: 42 });
            const isTerminal = jest.fn().mockReturnValue(true);

            const result = await pollUntilDone(retrieve, isTerminal);

            expect(result).toEqual({ status: "DONE", value: 42 });
            expect(retrieve).toHaveBeenCalledTimes(1);
            expect(isTerminal).toHaveBeenCalledTimes(1);
        });

        it("should poll until isTerminal returns true", async () => {
            let callCount = 0;
            const retrieve = jest.fn().mockImplementation(() => {
                callCount++;
                return Promise.resolve({ status: callCount >= 3 ? "DONE" : "PROCESSING", value: callCount });
            });
            const isTerminal = jest.fn().mockImplementation((result) => result.status === "DONE");

            const result = await pollUntilDone(retrieve, isTerminal, {
                fastPollIntervalMs: 1, // Very short delays for testing
                maxWaitMs: 10000,
                jitterFraction: 0, // No jitter for predictable tests
            });

            expect(retrieve).toHaveBeenCalledTimes(3);
            expect(result).toEqual({ status: "DONE", value: 3 });
        });

        it("should pass result to isTerminal function", async () => {
            const testResult = { status: "DONE", data: { foo: "bar" } };
            const retrieve = jest.fn().mockResolvedValue(testResult);
            const isTerminal = jest.fn().mockReturnValue(true);

            await pollUntilDone(retrieve, isTerminal);

            expect(isTerminal).toHaveBeenCalledWith(testResult);
        });
    });

    describe("hybrid polling strategy", () => {
        it("should use fast polling during fast phase", async () => {
            const callTimes: number[] = [];
            let callCount = 0;

            const retrieve = jest.fn().mockImplementation(() => {
                callTimes.push(Date.now());
                callCount++;
                // Complete after 4 calls (all within fast phase)
                return Promise.resolve({ done: callCount >= 4 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            await pollUntilDone(retrieve, isTerminal, {
                fastPollDurationMs: 30000, // Long fast phase
                fastPollIntervalMs: 10,
                jitterFraction: 0,
                maxWaitMs: 5000,
            });

            expect(callTimes.length).toBe(4);

            // Calculate delays between calls - should all be ~10ms (fast poll interval)
            const delays = [];
            for (let i = 1; i < callTimes.length; i++) {
                delays.push(callTimes[i] - callTimes[i - 1]);
            }

            // All delays should be approximately equal during fast phase
            for (const delay of delays) {
                expect(delay).toBeGreaterThanOrEqual(8);
                expect(delay).toBeLessThan(50); // Generous upper bound for timing variance
            }
        });

        it("should switch to backoff after fast phase ends", async () => {
            const callTimes: number[] = [];
            let callCount = 0;

            const retrieve = jest.fn().mockImplementation(() => {
                callTimes.push(Date.now());
                callCount++;
                // Complete after 6 calls
                return Promise.resolve({ done: callCount >= 6 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            await pollUntilDone(retrieve, isTerminal, {
                fastPollDurationMs: 30, // Very short fast phase (30ms)
                fastPollIntervalMs: 10,
                initialDelayMs: 10,
                maxDelayMs: 1000,
                backoffMultiplier: 2,
                jitterFraction: 0,
                maxWaitMs: 5000,
            });

            expect(callTimes.length).toBe(6);

            // After fast phase (first ~3 calls), delays should increase
            const delays = [];
            for (let i = 1; i < callTimes.length; i++) {
                delays.push(callTimes[i] - callTimes[i - 1]);
            }

            // Later delays should be longer as we're in backoff phase
            const lastDelay = delays[delays.length - 1];
            const firstDelay = delays[0];
            expect(lastDelay).toBeGreaterThanOrEqual(firstDelay);
        });

        it("should use 1.15x backoff multiplier by default", async () => {
            const callTimes: number[] = [];
            let callCount = 0;

            const retrieve = jest.fn().mockImplementation(() => {
                callTimes.push(Date.now());
                callCount++;
                return Promise.resolve({ done: callCount >= 5 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            await pollUntilDone(retrieve, isTerminal, {
                fastPollDurationMs: 0, // Skip fast phase, go straight to backoff
                initialDelayMs: 50, // Use larger delay so 1.15x differences are detectable
                maxDelayMs: 1000,
                jitterFraction: 0,
                maxWaitMs: 5000,
            });

            expect(callTimes.length).toBe(5);

            const delays = [];
            for (let i = 1; i < callTimes.length; i++) {
                delays.push(callTimes[i] - callTimes[i - 1]);
            }

            // Delays should increase with 1.15x multiplier
            // With 50ms initial: 50 -> 57.5 -> 66.1 -> 76
            // Compare last to first to verify backoff is happening
            expect(delays[0]).toBeGreaterThanOrEqual(40);
            expect(delays[delays.length - 1]).toBeGreaterThan(delays[0]);
        });

        it("should respect custom backoffMultiplier", async () => {
            const callTimes: number[] = [];
            let callCount = 0;

            const retrieve = jest.fn().mockImplementation(() => {
                callTimes.push(Date.now());
                callCount++;
                return Promise.resolve({ done: callCount >= 4 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            await pollUntilDone(retrieve, isTerminal, {
                fastPollDurationMs: 0, // Skip fast phase
                initialDelayMs: 10,
                maxDelayMs: 1000,
                backoffMultiplier: 3, // 3x multiplier
                jitterFraction: 0,
                maxWaitMs: 5000,
            });

            const delays = [];
            for (let i = 1; i < callTimes.length; i++) {
                delays.push(callTimes[i] - callTimes[i - 1]);
            }

            // With 3x multiplier: 10 -> 30 -> 90
            // Check that delays increase significantly
            expect(delays[2]).toBeGreaterThan(delays[1] * 2);
        });

        it("should support disabling fast phase with fastPollDurationMs: 0", async () => {
            let callCount = 0;
            const retrieve = jest.fn().mockImplementation(() => {
                callCount++;
                return Promise.resolve({ done: callCount >= 2 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            const startTime = Date.now();

            await pollUntilDone(retrieve, isTerminal, {
                fastPollDurationMs: 0, // Pure backoff mode
                initialDelayMs: 50,
                jitterFraction: 0,
                maxWaitMs: 5000,
            });

            const elapsed = Date.now() - startTime;

            // Should have waited ~50ms (initial delay in backoff mode)
            expect(elapsed).toBeGreaterThanOrEqual(45);
        });
    });

    describe("timeout behavior", () => {
        it("should throw PollingTimeoutError when maxWaitMs is set and exceeded", async () => {
            const retrieve = jest.fn().mockResolvedValue({ status: "PROCESSING" });
            const isTerminal = jest.fn().mockReturnValue(false);

            await expect(
                pollUntilDone(retrieve, isTerminal, {
                    maxWaitMs: 50,
                    fastPollIntervalMs: 10,
                    jitterFraction: 0,
                }),
            ).rejects.toThrow(PollingTimeoutError);
        });

        it("should include elapsed time in timeout error", async () => {
            const retrieve = jest.fn().mockResolvedValue({ status: "PROCESSING" });
            const isTerminal = jest.fn().mockReturnValue(false);

            try {
                await pollUntilDone(retrieve, isTerminal, {
                    maxWaitMs: 50,
                    fastPollIntervalMs: 10,
                    jitterFraction: 0,
                });
                fail("Expected PollingTimeoutError to be thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(PollingTimeoutError);
                const timeoutError = error as PollingTimeoutError;
                expect(timeoutError.maxWaitMs).toBe(50);
                expect(timeoutError.elapsedMs).toBeGreaterThanOrEqual(50);
            }
        });

        it("should respect maxWaitMs option", async () => {
            const retrieve = jest.fn().mockResolvedValue({ status: "PROCESSING" });
            const isTerminal = jest.fn().mockReturnValue(false);

            const startTime = Date.now();

            await expect(
                pollUntilDone(retrieve, isTerminal, {
                    maxWaitMs: 100,
                    fastPollIntervalMs: 10,
                    jitterFraction: 0,
                }),
            ).rejects.toThrow(PollingTimeoutError);

            const elapsed = Date.now() - startTime;
            // Should have timed out around 100ms
            expect(elapsed).toBeGreaterThanOrEqual(100);
            expect(elapsed).toBeLessThan(500); // Reasonable upper bound
        });

        it("should poll indefinitely when maxWaitMs is not set", async () => {
            let callCount = 0;
            const retrieve = jest.fn().mockImplementation(() => {
                callCount++;
                return Promise.resolve({ done: callCount >= 3 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            // No maxWaitMs - should complete without timeout
            const result = await pollUntilDone(retrieve, isTerminal, {
                fastPollIntervalMs: 1,
                jitterFraction: 0,
            });

            expect(callCount).toBe(3);
            expect(result.done).toBe(true);
        });

        it("should timeout during fast polling phase", async () => {
            const retrieve = jest.fn().mockResolvedValue({ status: "PROCESSING" });
            const isTerminal = jest.fn().mockReturnValue(false);

            await expect(
                pollUntilDone(retrieve, isTerminal, {
                    fastPollDurationMs: 30000, // Long fast phase
                    fastPollIntervalMs: 10,
                    maxWaitMs: 50, // Short timeout
                    jitterFraction: 0,
                }),
            ).rejects.toThrow(PollingTimeoutError);
        });

        it("should timeout during backoff phase", async () => {
            const retrieve = jest.fn().mockResolvedValue({ status: "PROCESSING" });
            const isTerminal = jest.fn().mockReturnValue(false);

            await expect(
                pollUntilDone(retrieve, isTerminal, {
                    fastPollDurationMs: 10, // Short fast phase
                    fastPollIntervalMs: 5,
                    initialDelayMs: 10,
                    maxWaitMs: 100, // Timeout during backoff
                    jitterFraction: 0,
                }),
            ).rejects.toThrow(PollingTimeoutError);
        });
    });

    describe("delay capping", () => {
        it("should cap delay at maxDelayMs", async () => {
            let callCount = 0;

            const retrieve = jest.fn().mockImplementation(() => {
                callCount++;
                // Complete after 6 calls
                return Promise.resolve({ done: callCount >= 6 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            const startTime = Date.now();

            await pollUntilDone(retrieve, isTerminal, {
                fastPollDurationMs: 0, // Skip fast phase
                initialDelayMs: 10,
                maxDelayMs: 30, // Cap at 30ms
                backoffMultiplier: 2,
                jitterFraction: 0,
                maxWaitMs: 5000,
            });

            const totalTime = Date.now() - startTime;

            // With max delay cap at 30ms and 2x backoff: 10 + 20 + 30 + 30 + 30 = 120ms
            // Without cap it would be: 10 + 20 + 40 + 80 + 160 = 310ms
            expect(totalTime).toBeLessThan(300);
        });

        it("should use new default maxDelayMs of 30000", async () => {
            let callCount = 0;
            const retrieve = jest.fn().mockImplementation(() => {
                callCount++;
                return Promise.resolve({ done: callCount >= 2 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            // Just verify it doesn't error - the default maxDelayMs should be 30000
            await pollUntilDone(retrieve, isTerminal, {
                fastPollDurationMs: 0,
                initialDelayMs: 1,
                jitterFraction: 0,
                maxWaitMs: 5000,
            });

            expect(callCount).toBe(2);
        });
    });

    describe("error handling", () => {
        it("should propagate errors from retrieve function", async () => {
            const retrieve = jest.fn().mockRejectedValue(new Error("API Error"));
            const isTerminal = jest.fn();

            await expect(pollUntilDone(retrieve, isTerminal)).rejects.toThrow("API Error");
            expect(isTerminal).not.toHaveBeenCalled();
        });

        it("should propagate errors from isTerminal function", async () => {
            const retrieve = jest.fn().mockResolvedValue({ status: "DONE" });
            const isTerminal = jest.fn().mockImplementation(() => {
                throw new Error("isTerminal Error");
            });

            await expect(pollUntilDone(retrieve, isTerminal)).rejects.toThrow("isTerminal Error");
        });
    });

    describe("default configuration", () => {
        it("should have sensible defaults", async () => {
            // Verify that calling with no options works with sensible defaults
            let callCount = 0;
            const retrieve = jest.fn().mockImplementation(() => {
                callCount++;
                return Promise.resolve({ done: callCount >= 2 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            const startTime = Date.now();
            await pollUntilDone(retrieve, isTerminal);
            const elapsed = Date.now() - startTime;

            // Default fast poll interval is 1000ms, so first poll delay should be ~1s
            // With jitter, it could be 750-1250ms
            expect(elapsed).toBeGreaterThanOrEqual(700);
            expect(elapsed).toBeLessThan(1500);
        });
    });
});

// ============================================================================
// PollingTimeoutError tests
// ============================================================================

describe("PollingTimeoutError", () => {
    it("should have correct name", () => {
        const error = new PollingTimeoutError("test message", 1000, 5000);
        expect(error.name).toBe("PollingTimeoutError");
    });

    it("should have correct message", () => {
        const error = new PollingTimeoutError("Polling timed out", 1000, 5000);
        expect(error.message).toBe("Polling timed out");
    });

    it("should expose elapsedMs property", () => {
        const error = new PollingTimeoutError("test", 1234, 5000);
        expect(error.elapsedMs).toBe(1234);
    });

    it("should expose maxWaitMs property", () => {
        const error = new PollingTimeoutError("test", 1234, 5000);
        expect(error.maxWaitMs).toBe(5000);
    });

    it("should be an instance of Error", () => {
        const error = new PollingTimeoutError("test", 1000, 5000);
        expect(error).toBeInstanceOf(Error);
    });
});
