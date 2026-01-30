import { calculateBackoffDelay, pollUntilDone, PollingTimeoutError } from "./Polling";
import type { PollingOptions } from "./Polling";

// ============================================================================
// calculateBackoffDelay tests
// ============================================================================

describe("calculateBackoffDelay", () => {
    // Mock Math.random to have predictable tests
    const originalRandom = Math.random;

    afterEach(() => {
        Math.random = originalRandom;
    });

    describe("exponential backoff calculation", () => {
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
                initialDelayMs: 1, // Very short delays for testing
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

    describe("timeout behavior", () => {
        it("should throw PollingTimeoutError when maxWaitMs is set and exceeded", async () => {
            const retrieve = jest.fn().mockResolvedValue({ status: "PROCESSING" });
            const isTerminal = jest.fn().mockReturnValue(false);

            await expect(
                pollUntilDone(retrieve, isTerminal, {
                    maxWaitMs: 50,
                    initialDelayMs: 10,
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
                    initialDelayMs: 10,
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
                    initialDelayMs: 10,
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
                initialDelayMs: 1,
                jitterFraction: 0,
            });

            expect(callCount).toBe(3);
            expect(result.done).toBe(true);
        });
    });

    describe("exponential backoff", () => {
        it("should increase delay between polls", async () => {
            const callTimes: number[] = [];
            let callCount = 0;

            const retrieve = jest.fn().mockImplementation(() => {
                callTimes.push(Date.now());
                callCount++;
                // Complete after 4 calls
                return Promise.resolve({ done: callCount >= 4 });
            });
            const isTerminal = jest.fn().mockImplementation((r) => r.done);

            await pollUntilDone(retrieve, isTerminal, {
                initialDelayMs: 10,
                maxDelayMs: 1000,
                jitterFraction: 0, // No jitter for predictable tests
                maxWaitMs: 5000,
            });

            expect(callTimes.length).toBe(4);

            // Calculate delays between calls
            const delays = [];
            for (let i = 1; i < callTimes.length; i++) {
                delays.push(callTimes[i] - callTimes[i - 1]);
            }

            // First delay should be ~10ms, second ~20ms, third ~40ms (exponential)
            // Allow some tolerance for timing
            expect(delays[0]).toBeGreaterThanOrEqual(8);
            expect(delays[1]).toBeGreaterThan(delays[0]);
        });

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
                initialDelayMs: 10,
                maxDelayMs: 30, // Cap at 30ms
                jitterFraction: 0,
                maxWaitMs: 5000,
            });

            const totalTime = Date.now() - startTime;

            // With max delay cap, should complete faster than exponential would suggest
            // 10 + 20 + 30 + 30 + 30 = 120ms without cap it would be 10+20+40+80+160 = 310ms
            expect(totalTime).toBeLessThan(300);
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
