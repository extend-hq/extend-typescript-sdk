import { z } from "zod";
import { ExtractRunsWrapper, PollingTimeoutError } from "./ExtractRunsWrapper";
import { extendSchema, extendDate, extendCurrency } from "../../schema";
import * as Extend from "../../../api";

// ============================================================================
// Mock setup
// ============================================================================

// Create a mock for the ExtractRuns base class
const mockCreate = jest.fn();
const mockRetrieve = jest.fn();

// We need to mock the parent class methods
jest.mock("../../../api/resources/extractRuns/client/Client", () => ({
    ExtractRuns: jest.fn().mockImplementation(() => ({
        create: mockCreate,
        retrieve: mockRetrieve,
    })),
}));

// ============================================================================
// Test helpers
// ============================================================================

function createMockExtractRun(overrides: Partial<Extend.ExtractRun> = {}): Extend.ExtractRun {
    return {
        object: "extract_run",
        id: "extract_run_test123",
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
            description: null,
            createdAt: "2024-01-01T00:00:00Z",
        },
        status: "PROCESSED",
        output: { value: {}, metadata: {} },
        initialOutput: { value: {}, metadata: {} },
        reviewedOutput: { value: {}, metadata: {} },
        metadata: {},
        reviewed: false,
        edited: false,
        config: { schema: { type: "object", properties: {} } },
        file: {
            object: "file_summary",
            id: "file_789",
            name: "test.pdf",
            type: "PDF",
            parentFileId: null,
            metadata: {},
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
        },
        dashboardUrl: "https://dashboard.extend.ai/extract-runs/extract_run_test123",
        edits: {},
        usage: { credits: 1 },
        failureReason: null,
        failureMessage: null,
        parseRunId: null,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        ...overrides,
    };
}

// ============================================================================
// Tests
// ============================================================================

describe("ExtractRunsWrapper", () => {
    let wrapper: ExtractRunsWrapper;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a new instance for each test
        // We need to bypass the constructor by creating a plain object
        wrapper = Object.create(ExtractRunsWrapper.prototype);
        // Attach the mocked methods
        (wrapper as unknown as { create: typeof mockCreate }).create = mockCreate;
        (wrapper as unknown as { retrieve: typeof mockRetrieve }).retrieve = mockRetrieve;
    });

    describe("createAndPoll", () => {
        describe("with standard (untyped) request", () => {
            it("should create and poll until processed", async () => {
                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse1: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse2: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValueOnce(retrieveResponse1).mockResolvedValueOnce(retrieveResponse2);

                const request: Extend.ExtractRunsCreateRequest = {
                    file: { url: "https://example.com/doc.pdf" },
                    extractor: { id: "extractor_123" },
                };

                const result = await wrapper.createAndPoll(request, {
                    initialDelayMs: 1,
                    maxWaitMs: 10000,
                    jitterFraction: 0,
                });

                expect(mockCreate).toHaveBeenCalledWith(request, undefined);
                expect(mockRetrieve).toHaveBeenCalledWith("extract_run_test123", undefined);
                expect(result.extractRun.status).toBe("PROCESSED");
            });

            it("should return immediately if already processed on first retrieve", async () => {
                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                const request: Extend.ExtractRunsCreateRequest = {
                    file: { url: "https://example.com/doc.pdf" },
                    extractor: { id: "extractor_123" },
                };

                const result = await wrapper.createAndPoll(request);

                expect(result.extractRun.status).toBe("PROCESSED");
                expect(mockRetrieve).toHaveBeenCalledTimes(1);
            });

            it("should handle FAILED status as terminal", async () => {
                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "FAILED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                const result = await wrapper.createAndPoll({
                    file: { url: "https://example.com/doc.pdf" },
                    extractor: { id: "extractor_123" },
                });

                expect(result.extractRun.status).toBe("FAILED");
            });

            it("should handle CANCELLED status as terminal", async () => {
                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "CANCELLED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                const result = await wrapper.createAndPoll({
                    file: { url: "https://example.com/doc.pdf" },
                    extractor: { id: "extractor_123" },
                });

                expect(result.extractRun.status).toBe("CANCELLED");
            });

            it("should throw PollingTimeoutError when timeout exceeded", async () => {
                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                await expect(
                    wrapper.createAndPoll(
                        {
                            file: { url: "https://example.com/doc.pdf" },
                            extractor: { id: "extractor_123" },
                        },
                        {
                            maxWaitMs: 50,
                            initialDelayMs: 10,
                            jitterFraction: 0,
                        },
                    ),
                ).rejects.toThrow(PollingTimeoutError);
            });

            it("should pass request options to create and retrieve", async () => {
                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                const requestOptions = { timeoutInSeconds: 30 };

                await wrapper.createAndPoll(
                    {
                        file: { url: "https://example.com/doc.pdf" },
                        extractor: { id: "extractor_123" },
                    },
                    { requestOptions },
                );

                expect(mockCreate).toHaveBeenCalledWith(expect.anything(), requestOptions);
                expect(mockRetrieve).toHaveBeenCalledWith(expect.anything(), requestOptions);
            });
        });

        describe("with typed inline config", () => {
            it("should convert typed schema to API format", async () => {
                const schema = extendSchema({
                    invoice_number: z.string().nullable(),
                    total: extendCurrency(),
                });

                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({
                        status: "PROCESSED",
                        output: {
                            value: {
                                invoice_number: "INV-001",
                                total: { amount: 100, iso_4217_currency_code: "USD" },
                            },
                            metadata: {},
                        },
                    }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                const result = await wrapper.createAndPoll({
                    file: { url: "https://example.com/doc.pdf" },
                    config: {
                        schema,
                        baseProcessor: "extraction_performance",
                    },
                });

                // Verify the create call received converted schema
                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        file: { url: "https://example.com/doc.pdf" },
                        config: expect.objectContaining({
                            baseProcessor: "extraction_performance",
                            schema: expect.objectContaining({
                                type: "object",
                                properties: expect.objectContaining({
                                    invoice_number: { type: ["string", "null"] },
                                    total: expect.objectContaining({
                                        "extend:type": "currency",
                                    }),
                                }),
                            }),
                        }),
                    }),
                    undefined,
                );

                expect(result.extractRun.output.value).toEqual({
                    invoice_number: "INV-001",
                    total: { amount: 100, iso_4217_currency_code: "USD" },
                });
            });

            it("should pass all config options through", async () => {
                const schema = extendSchema({
                    name: z.string().nullable(),
                });

                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                await wrapper.createAndPoll({
                    file: { url: "https://example.com/doc.pdf" },
                    config: {
                        schema,
                        baseProcessor: "extraction_performance",
                        baseVersion: "1.0",
                        extractionRules: "Extract all fields carefully",
                        advancedOptions: {
                            reviewAgent: { enabled: true },
                        },
                    },
                });

                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        config: expect.objectContaining({
                            baseProcessor: "extraction_performance",
                            baseVersion: "1.0",
                            extractionRules: "Extract all fields carefully",
                            advancedOptions: {
                                reviewAgent: { enabled: true },
                            },
                        }),
                    }),
                    undefined,
                );
            });
        });

        describe("with typed extractor.overrideConfig", () => {
            it("should convert typed overrideConfig schema to API format", async () => {
                const schema = extendSchema({
                    date: extendDate(),
                    amount: z.number().nullable(),
                });

                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({
                        status: "PROCESSED",
                        output: {
                            value: {
                                date: "2024-01-15",
                                amount: 99.99,
                            },
                            metadata: {},
                        },
                    }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                const result = await wrapper.createAndPoll({
                    file: { url: "https://example.com/doc.pdf" },
                    extractor: {
                        id: "extractor_abc123",
                        overrideConfig: {
                            schema,
                            baseProcessor: "extraction_performance",
                        },
                    },
                });

                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        extractor: expect.objectContaining({
                            id: "extractor_abc123",
                            overrideConfig: expect.objectContaining({
                                baseProcessor: "extraction_performance",
                                schema: expect.objectContaining({
                                    type: "object",
                                    properties: expect.objectContaining({
                                        date: expect.objectContaining({
                                            "extend:type": "date",
                                        }),
                                        amount: { type: ["number", "null"] },
                                    }),
                                }),
                            }),
                        }),
                    }),
                    undefined,
                );

                expect(result.extractRun.output.value).toEqual({
                    date: "2024-01-15",
                    amount: 99.99,
                });
            });

            it("should pass extractor version when provided", async () => {
                const schema = extendSchema({
                    field: z.string().nullable(),
                });

                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                await wrapper.createAndPoll({
                    file: { url: "https://example.com/doc.pdf" },
                    extractor: {
                        id: "extractor_abc123",
                        version: "2",
                        overrideConfig: {
                            schema,
                            baseProcessor: "extraction_performance",
                        },
                    },
                });

                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        extractor: expect.objectContaining({
                            id: "extractor_abc123",
                            version: "2",
                        }),
                    }),
                    undefined,
                );
            });
        });

        describe("with standard extractor (no typed override)", () => {
            it("should pass through untyped extractor request unchanged", async () => {
                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                const request: Extend.ExtractRunsCreateRequest = {
                    file: { url: "https://example.com/doc.pdf" },
                    extractor: {
                        id: "extractor_abc123",
                        version: "1",
                    },
                    priority: 1,
                    metadata: { key: "value" },
                };

                await wrapper.createAndPoll(request);

                expect(mockCreate).toHaveBeenCalledWith(request, undefined);
            });
        });

        describe("priority and metadata passthrough", () => {
            it("should pass priority and metadata with typed config", async () => {
                const schema = extendSchema({
                    field: z.string().nullable(),
                });

                const createResponse: Extend.ExtractRunsCreateResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.ExtractRunsRetrieveResponse = {
                    extractRun: createMockExtractRun({ status: "PROCESSED" }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                await wrapper.createAndPoll({
                    file: { url: "https://example.com/doc.pdf" },
                    config: {
                        schema,
                        baseProcessor: "extraction_performance",
                    },
                    priority: 1,
                    metadata: { source: "test" },
                });

                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        priority: 1,
                        metadata: { source: "test" },
                    }),
                    undefined,
                );
            });
        });
    });
});

// ============================================================================
// Type inference tests (compile-time only)
// ============================================================================

describe("Type inference (compile-time)", () => {
    // These tests primarily verify that TypeScript types are correct.
    // They will pass at runtime but serve as documentation for expected types.

    it("should infer correct types from extendSchema", () => {
        const schema = extendSchema({
            name: z.string().nullable(),
            age: z.number().nullable(),
            active: z.boolean().nullable(),
        });

        // TypeScript should infer _output type
        type OutputType = typeof schema._output;

        // This would cause a compile error if types were wrong:
        const validOutput: OutputType = {
            name: "John",
            age: 30,
            active: true,
        };

        expect(validOutput).toBeDefined();
    });

    it("should infer currency type correctly", () => {
        const schema = extendSchema({
            total: extendCurrency(),
        });

        type OutputType = typeof schema._output;

        const validOutput: OutputType = {
            total: {
                amount: 100,
                iso_4217_currency_code: "USD",
            },
        };

        expect(validOutput).toBeDefined();
    });

    it("should infer array types correctly", () => {
        const schema = extendSchema({
            items: z.array(
                z.object({
                    name: z.string().nullable(),
                    price: z.number().nullable(),
                }),
            ),
        });

        type OutputType = typeof schema._output;

        const validOutput: OutputType = {
            items: [
                { name: "Item 1", price: 10 },
                { name: "Item 2", price: null },
            ],
        };

        expect(validOutput).toBeDefined();
    });
});
