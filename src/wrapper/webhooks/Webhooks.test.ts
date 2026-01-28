import * as crypto from "crypto";
import {
    Webhooks,
    WebhookSignatureVerificationError,
    SignedUrlNotAllowedError,
    WebhookPayloadFetchError,
    WebhookHeaders,
    RawWebhookEvent,
} from "./Webhooks";
import * as Extend from "../../api";

// ============================================================================
// Test Helpers
// ============================================================================

function createSignature(body: string, secret: string, timestamp: number): string {
    const message = `v0:${timestamp}:${body}`;
    return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

function createValidHeaders(body: string, secret: string, timestamp?: number): WebhookHeaders {
    const ts = timestamp ?? Math.floor(Date.now() / 1000);
    return {
        "x-extend-request-timestamp": ts.toString(),
        "x-extend-request-signature": createSignature(body, secret, ts),
    };
}

// Sample webhook events with complete valid payloads
const sampleWorkflowRunPayload: Extend.WorkflowRun = {
    object: "workflow_run",
    id: "workflow_run_abc123",
    workflow: {
        object: "workflow_summary",
        id: "workflow_123",
        name: "Test Workflow",
    },
    workflowVersion: {
        object: "workflow_version_summary",
        id: "workflow_version_456",
        version: "1",
        name: "Test Workflow v1",
    },
    dashboardUrl: "https://dashboard.extend.ai/workflows/workflow_run_abc123",
    status: "PROCESSED",
    metadata: {},
    files: [
        {
            object: "file_summary",
            id: "file_789",
            name: "test.pdf",
            type: "PDF",
            metadata: {},
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
        },
    ],
    reviewed: false,
    stepRuns: [],
};

const sampleWorkflowRunEvent: Extend.WebhookEvent = {
    eventId: "evt_123",
    eventType: "workflow_run.completed",
    payload: sampleWorkflowRunPayload,
};

const sampleExtractRunPayload: Extend.ExtractRun = {
    object: "extract_run",
    id: "extract_run_def456",
    extractor: {
        object: "extractor_summary",
        id: "extractor_123",
        name: "Test Extractor",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    extractorVersion: {
        object: "extractor_version_summary",
        id: "extractor_version_456",
        version: "1",
        extractorId: "extractor_123",
        createdAt: "2024-01-01T00:00:00Z",
    },
    status: "PROCESSED",
    output: { value: { field: "value" }, metadata: {} },
    initialOutput: { value: { field: "value" }, metadata: {} },
    reviewedOutput: { value: { field: "value" }, metadata: {} },
    metadata: {},
    reviewed: false,
    edited: false,
    config: { schema: { type: "object", properties: {} } },
    file: {
        object: "file_summary",
        id: "file_789",
        name: "test.pdf",
        type: "PDF",
        metadata: {},
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    dashboardUrl: "https://dashboard.extend.ai/extract-runs/extract_run_def456",
    usage: { credits: 1 },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
};

const sampleExtractRunEvent: Extend.WebhookEvent = {
    eventId: "evt_456",
    eventType: "extract_run.processed",
    payload: sampleExtractRunPayload,
};

const sampleSignedUrlEvent = {
    eventId: "evt_789",
    eventType: "workflow_run.completed" as const,
    payload: {
        object: "signed_data_url" as const,
        data: "https://storage.example.com/signed-payload?token=abc123",
        id: "wr_xyz",
        metadata: { env: "production" },
    },
};

const SECRET = "wss_test_secret_123";

// ============================================================================
// Tests
// ============================================================================

describe("Webhooks", () => {
    let webhooks: Webhooks;

    beforeEach(() => {
        webhooks = new Webhooks();
    });

    describe("verifyAndParse", () => {
        describe("with valid signature", () => {
            it("should return WebhookEvent for normal payload", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers = createValidHeaders(body, SECRET);

                const event = webhooks.verifyAndParse(body, headers, SECRET);

                expect(event.eventId).toBe("evt_123");
                expect(event.eventType).toBe("workflow_run.completed");
                expect(event.payload).toEqual(sampleWorkflowRunEvent.payload);
            });

            it("should return WebhookEvent for extract_run.processed", () => {
                const body = JSON.stringify(sampleExtractRunEvent);
                const headers = createValidHeaders(body, SECRET);

                const event = webhooks.verifyAndParse(body, headers, SECRET);

                expect(event.eventId).toBe("evt_456");
                expect(event.eventType).toBe("extract_run.processed");
            });

            it("should throw SignedUrlNotAllowedError for signed URL payload without opt-in", () => {
                const body = JSON.stringify(sampleSignedUrlEvent);
                const headers = createValidHeaders(body, SECRET);

                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow(SignedUrlNotAllowedError);
            });

            it("should throw SignedUrlNotAllowedError with helpful message", () => {
                const body = JSON.stringify(sampleSignedUrlEvent);
                const headers = createValidHeaders(body, SECRET);

                try {
                    webhooks.verifyAndParse(body, headers, SECRET);
                    fail("Expected SignedUrlNotAllowedError to be thrown");
                } catch (error) {
                    expect(error).toBeInstanceOf(SignedUrlNotAllowedError);
                    expect((error as Error).message).toContain("allowSignedUrl");
                }
            });

            it("should return RawWebhookEvent for signed URL payload with allowSignedUrl: true", () => {
                const body = JSON.stringify(sampleSignedUrlEvent);
                const headers = createValidHeaders(body, SECRET);

                const event = webhooks.verifyAndParse(body, headers, SECRET, { allowSignedUrl: true });

                expect(event.eventId).toBe("evt_789");
                expect(event.eventType).toBe("workflow_run.completed");
                expect(webhooks.isSignedUrlEvent(event)).toBe(true);
                if (webhooks.isSignedUrlEvent(event)) {
                    expect(event.payload.object).toBe("signed_data_url");
                    expect(event.payload.data).toBe("https://storage.example.com/signed-payload?token=abc123");
                    expect(event.payload.metadata?.env).toBe("production");
                }
            });

            it("should return normal event with allowSignedUrl: true when not signed URL", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers = createValidHeaders(body, SECRET);

                const event = webhooks.verifyAndParse(body, headers, SECRET, { allowSignedUrl: true });

                expect(webhooks.isSignedUrlEvent(event)).toBe(false);
                expect(event.eventType).toBe("workflow_run.completed");
            });

            it("should work with allowSignedUrl: false explicitly", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers = createValidHeaders(body, SECRET);

                const event = webhooks.verifyAndParse(body, headers, SECRET, { allowSignedUrl: false });

                expect(event.eventType).toBe("workflow_run.completed");
            });
        });

        describe("with invalid signature", () => {
            it("should throw WebhookSignatureVerificationError for wrong signature", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers: WebhookHeaders = {
                    "x-extend-request-timestamp": Math.floor(Date.now() / 1000).toString(),
                    "x-extend-request-signature": "invalid_signature",
                };

                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow(WebhookSignatureVerificationError);
            });

            it("should throw for missing timestamp header", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers: WebhookHeaders = {
                    "x-extend-request-signature": "some_signature",
                };

                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow(WebhookSignatureVerificationError);
                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow("Missing x-extend-request-timestamp header");
            });

            it("should throw for missing signature header", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers: WebhookHeaders = {
                    "x-extend-request-timestamp": Math.floor(Date.now() / 1000).toString(),
                };

                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow(WebhookSignatureVerificationError);
                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow("Missing x-extend-request-signature header");
            });

            it("should throw for missing signing secret", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers = createValidHeaders(body, SECRET);

                expect(() => {
                    webhooks.verifyAndParse(body, headers, "");
                }).toThrow(WebhookSignatureVerificationError);
                expect(() => {
                    webhooks.verifyAndParse(body, headers, "");
                }).toThrow("Missing signing secret");
            });

            it("should throw for tampered body", () => {
                const originalBody = JSON.stringify(sampleWorkflowRunEvent);
                const headers = createValidHeaders(originalBody, SECRET);
                const tamperedBody = JSON.stringify({ ...sampleWorkflowRunEvent, eventId: "evt_tampered" });

                expect(() => {
                    webhooks.verifyAndParse(tamperedBody, headers, SECRET);
                }).toThrow(WebhookSignatureVerificationError);
            });

            it("should throw for wrong secret", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers = createValidHeaders(body, SECRET);

                expect(() => {
                    webhooks.verifyAndParse(body, headers, "wrong_secret");
                }).toThrow(WebhookSignatureVerificationError);
            });
        });

        describe("timestamp validation", () => {
            it("should reject requests older than maxAgeSeconds", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
                const headers = createValidHeaders(body, SECRET, oldTimestamp);

                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow(WebhookSignatureVerificationError);
                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow(/too old/);
            });

            it("should accept requests within maxAgeSeconds", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const recentTimestamp = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
                const headers = createValidHeaders(body, SECRET, recentTimestamp);

                const event = webhooks.verifyAndParse(body, headers, SECRET);
                expect(event.eventId).toBe("evt_123");
            });

            it("should allow custom maxAgeSeconds", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
                const headers = createValidHeaders(body, SECRET, oldTimestamp);

                // Should fail with default (300s)
                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow(/too old/);

                // Should succeed with 900s
                const event = webhooks.verifyAndParse(body, headers, SECRET, { maxAgeSeconds: 900 });
                expect(event.eventId).toBe("evt_123");
            });

            it("should disable timestamp validation when maxAgeSeconds is 0", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const veryOldTimestamp = Math.floor(Date.now() / 1000) - 86400; // 1 day ago
                const headers = createValidHeaders(body, SECRET, veryOldTimestamp);

                const event = webhooks.verifyAndParse(body, headers, SECRET, { maxAgeSeconds: 0 });
                expect(event.eventId).toBe("evt_123");
            });

            it("should reject timestamps too far in the future", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const futureTimestamp = Math.floor(Date.now() / 1000) + 120; // 2 minutes in future
                const headers = createValidHeaders(body, SECRET, futureTimestamp);

                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow(/future/);
            });

            it("should accept timestamps slightly in the future (clock skew)", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const slightlyFutureTimestamp = Math.floor(Date.now() / 1000) + 30; // 30 seconds in future
                const headers = createValidHeaders(body, SECRET, slightlyFutureTimestamp);

                const event = webhooks.verifyAndParse(body, headers, SECRET);
                expect(event.eventId).toBe("evt_123");
            });

            it("should throw for invalid timestamp format", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const headers: WebhookHeaders = {
                    "x-extend-request-timestamp": "not-a-number",
                    "x-extend-request-signature": createSignature(body, SECRET, 0),
                };

                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow("Invalid timestamp format");
            });
        });

        describe("JSON parsing", () => {
            it("should throw for invalid JSON body", () => {
                const body = "not valid json";
                const headers = createValidHeaders(body, SECRET);

                expect(() => {
                    webhooks.verifyAndParse(body, headers, SECRET);
                }).toThrow("Failed to parse webhook body as JSON");
            });
        });

        describe("case-insensitive headers", () => {
            it("should work with lowercase header names", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const ts = Math.floor(Date.now() / 1000);
                const headers: WebhookHeaders = {
                    "x-extend-request-timestamp": ts.toString(),
                    "x-extend-request-signature": createSignature(body, SECRET, ts),
                };

                const event = webhooks.verifyAndParse(body, headers, SECRET);
                expect(event.eventId).toBe("evt_123");
            });

            it("should work with array header values", () => {
                const body = JSON.stringify(sampleWorkflowRunEvent);
                const ts = Math.floor(Date.now() / 1000);
                // Test with array headers (common in some HTTP frameworks)
                const headers = {
                    "x-extend-request-timestamp": [ts.toString()],
                    "x-extend-request-signature": [createSignature(body, SECRET, ts)],
                } as unknown as WebhookHeaders;

                const event = webhooks.verifyAndParse(body, headers, SECRET);
                expect(event.eventId).toBe("evt_123");
            });
        });
    });

    describe("verify", () => {
        it("should return true for valid signature", () => {
            const body = JSON.stringify(sampleWorkflowRunEvent);
            const headers = createValidHeaders(body, SECRET);

            const isValid = webhooks.verify(body, headers, SECRET);

            expect(isValid).toBe(true);
        });

        it("should return false for invalid signature", () => {
            const body = JSON.stringify(sampleWorkflowRunEvent);
            const headers: WebhookHeaders = {
                "x-extend-request-timestamp": Math.floor(Date.now() / 1000).toString(),
                "x-extend-request-signature": "invalid",
            };

            const isValid = webhooks.verify(body, headers, SECRET);

            expect(isValid).toBe(false);
        });

        it("should return false for missing headers", () => {
            const body = JSON.stringify(sampleWorkflowRunEvent);

            expect(webhooks.verify(body, {}, SECRET)).toBe(false);
        });

        it("should return false for expired timestamp", () => {
            const body = JSON.stringify(sampleWorkflowRunEvent);
            const oldTimestamp = Math.floor(Date.now() / 1000) - 600;
            const headers = createValidHeaders(body, SECRET, oldTimestamp);

            expect(webhooks.verify(body, headers, SECRET)).toBe(false);
        });

        it("should respect maxAgeSeconds option", () => {
            const body = JSON.stringify(sampleWorkflowRunEvent);
            const oldTimestamp = Math.floor(Date.now() / 1000) - 600;
            const headers = createValidHeaders(body, SECRET, oldTimestamp);

            expect(webhooks.verify(body, headers, SECRET)).toBe(false);
            expect(webhooks.verify(body, headers, SECRET, { maxAgeSeconds: 900 })).toBe(true);
        });
    });

    describe("parse", () => {
        it("should parse a normal webhook event", () => {
            const body = JSON.stringify(sampleWorkflowRunEvent);

            const event = webhooks.parse(body);

            expect(event.eventId).toBe("evt_123");
            expect(event.eventType).toBe("workflow_run.completed");
        });

        it("should parse a signed URL webhook event", () => {
            const body = JSON.stringify(sampleSignedUrlEvent);

            const event = webhooks.parse(body);

            expect(event.eventId).toBe("evt_789");
            expect(webhooks.isSignedUrlEvent(event)).toBe(true);
        });

        it("should throw for invalid JSON", () => {
            expect(() => {
                webhooks.parse("not json");
            }).toThrow();
        });
    });

    describe("isSignedUrlEvent", () => {
        it("should return true for signed URL events", () => {
            const event: RawWebhookEvent = sampleSignedUrlEvent;

            expect(webhooks.isSignedUrlEvent(event)).toBe(true);
        });

        it("should return false for normal events", () => {
            const event: RawWebhookEvent = sampleWorkflowRunEvent;

            expect(webhooks.isSignedUrlEvent(event)).toBe(false);
        });

        it("should narrow the type correctly", () => {
            const event: RawWebhookEvent = sampleSignedUrlEvent;

            if (webhooks.isSignedUrlEvent(event)) {
                // TypeScript should know this is WebhookEventWithSignedUrl
                expect(event.payload.object).toBe("signed_data_url");
                expect(event.payload.data).toBe("https://storage.example.com/signed-payload?token=abc123");
                expect(event.payload.id).toBe("wr_xyz");
            } else {
                fail("Expected isSignedUrlEvent to return true");
            }
        });

        it("should correctly identify events without signed URL", () => {
            const event: RawWebhookEvent = sampleWorkflowRunEvent;

            if (!webhooks.isSignedUrlEvent(event)) {
                // TypeScript should know this is WebhookEvent
                expect((event.payload as Extend.WorkflowRun).id).toBe(sampleWorkflowRunPayload.id);
            } else {
                fail("Expected isSignedUrlEvent to return false");
            }
        });
    });

    describe("fetchSignedPayload", () => {
        const originalFetch = global.fetch;

        afterEach(() => {
            global.fetch = originalFetch;
        });

        it("should fetch and return the full event", async () => {
            const fullPayload = {
                id: "wr_xyz",
                object: "workflow_run",
                status: "PROCESSED",
                workflowId: "wf_123",
                workflowVersionId: "wfv_123",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            };

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(fullPayload),
            });

            const result = await webhooks.fetchSignedPayload(sampleSignedUrlEvent);

            expect(global.fetch).toHaveBeenCalledWith(sampleSignedUrlEvent.payload.data);
            expect(result.eventId).toBe("evt_789");
            expect(result.eventType).toBe("workflow_run.completed");
            expect(result.payload).toEqual(fullPayload);
        });

        it("should throw WebhookPayloadFetchError on HTTP error", async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 403,
                statusText: "Forbidden",
            });

            await expect(webhooks.fetchSignedPayload(sampleSignedUrlEvent)).rejects.toThrow(WebhookPayloadFetchError);
            await expect(webhooks.fetchSignedPayload(sampleSignedUrlEvent)).rejects.toThrow(/403/);
        });

        it("should throw WebhookPayloadFetchError on network error", async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

            await expect(webhooks.fetchSignedPayload(sampleSignedUrlEvent)).rejects.toThrow(WebhookPayloadFetchError);
            await expect(webhooks.fetchSignedPayload(sampleSignedUrlEvent)).rejects.toThrow(/Network error/);
        });

        it("should throw WebhookPayloadFetchError on JSON parse error", async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.reject(new Error("Invalid JSON")),
            });

            await expect(webhooks.fetchSignedPayload(sampleSignedUrlEvent)).rejects.toThrow(WebhookPayloadFetchError);
        });
    });

    describe("error classes", () => {
        it("WebhookSignatureVerificationError should have correct name", () => {
            const error = new WebhookSignatureVerificationError("test message");
            expect(error.name).toBe("WebhookSignatureVerificationError");
            expect(error.message).toBe("test message");
            expect(error).toBeInstanceOf(Error);
        });

        it("SignedUrlNotAllowedError should have correct name and message", () => {
            const error = new SignedUrlNotAllowedError();
            expect(error.name).toBe("SignedUrlNotAllowedError");
            expect(error.message).toContain("allowSignedUrl");
            expect(error).toBeInstanceOf(Error);
        });

        it("WebhookPayloadFetchError should have correct name", () => {
            const error = new WebhookPayloadFetchError("fetch failed");
            expect(error.name).toBe("WebhookPayloadFetchError");
            expect(error.message).toBe("fetch failed");
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe("type safety", () => {
        it("should return correct type based on allowSignedUrl option", () => {
            const body = JSON.stringify(sampleWorkflowRunEvent);
            const headers = createValidHeaders(body, SECRET);

            // Without allowSignedUrl - returns WebhookEvent
            const event1: Extend.WebhookEvent = webhooks.verifyAndParse(body, headers, SECRET);
            expect(event1.eventType).toBe("workflow_run.completed");

            // With allowSignedUrl: true - returns RawWebhookEvent
            const event2: RawWebhookEvent = webhooks.verifyAndParse(body, headers, SECRET, { allowSignedUrl: true });
            expect(event2.eventType).toBe("workflow_run.completed");

            // With allowSignedUrl: false - returns WebhookEvent
            const event3: Extend.WebhookEvent = webhooks.verifyAndParse(body, headers, SECRET, {
                allowSignedUrl: false,
            });
            expect(event3.eventType).toBe("workflow_run.completed");
        });
    });
});
