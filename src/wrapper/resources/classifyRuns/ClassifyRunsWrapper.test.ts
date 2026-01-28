import { ClassifyRunsWrapper, PollingTimeoutError } from "./ClassifyRunsWrapper";
import * as Extend from "../../../api";

// ============================================================================
// Mock setup
// ============================================================================

const mockCreate = jest.fn();
const mockRetrieve = jest.fn();

jest.mock("../../../api/resources/classifyRuns/client/Client", () => ({
    ClassifyRuns: jest.fn().mockImplementation(() => ({
        create: mockCreate,
        retrieve: mockRetrieve,
    })),
}));

// ============================================================================
// Test helpers
// ============================================================================

function createMockClassifyRun(overrides: Partial<Extend.ClassifyRun> = {}): Extend.ClassifyRun {
    return {
        object: "classify_run",
        id: "classify_run_test123",
        classifier: {
            object: "classifier_summary",
            id: "classifier_123",
            name: "Test Classifier",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
        },
        classifierVersion: {
            object: "classifier_version_summary",
            id: "classifier_version_456",
            version: "1",
            classifierId: "classifier_123",
            createdAt: "2024-01-01T00:00:00Z",
        },
        status: "PROCESSED",
        output: { id: "class_1", type: "invoice", confidence: 0.95, insights: [] },
        initialOutput: { id: "class_1", type: "invoice", confidence: 0.95, insights: [] },
        reviewedOutput: { id: "class_1", type: "invoice", confidence: 0.95, insights: [] },
        metadata: {},
        reviewed: false,
        edited: false,
        config: { classifications: [] },
        file: {
            object: "file_summary",
            id: "file_789",
            name: "test.pdf",
            type: "PDF",
            metadata: {},
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
        },
        dashboardUrl: "https://dashboard.extend.ai/classify-runs/classify_run_test123",
        usage: { credits: 1 },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        ...overrides,
    };
}

// ============================================================================
// Tests
// ============================================================================

describe("ClassifyRunsWrapper", () => {
    let wrapper: ClassifyRunsWrapper;

    beforeEach(() => {
        jest.clearAllMocks();

        wrapper = Object.create(ClassifyRunsWrapper.prototype);
        (wrapper as unknown as { create: typeof mockCreate }).create = mockCreate;
        (wrapper as unknown as { retrieve: typeof mockRetrieve }).retrieve = mockRetrieve;
    });

    describe("createAndPoll", () => {
        it("should create and poll until processed", async () => {
            const createResponse: Extend.ClassifyRunsCreateResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSING" }),
            };

            const retrieveResponse1: Extend.ClassifyRunsRetrieveResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSING" }),
            };

            const retrieveResponse2: Extend.ClassifyRunsRetrieveResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValueOnce(retrieveResponse1).mockResolvedValueOnce(retrieveResponse2);

            const request: Extend.ClassifyRunsCreateRequest = {
                file: { url: "https://example.com/doc.pdf" },
                classifier: { id: "classifier_123" },
            };

            const result = await wrapper.createAndPoll(request, {
                initialDelayMs: 1,
                maxWaitMs: 10000,
                jitterFraction: 0,
            });

            expect(mockCreate).toHaveBeenCalledWith(request, undefined);
            expect(mockRetrieve).toHaveBeenCalledWith("classify_run_test123", undefined);
            expect(result.classifyRun.status).toBe("PROCESSED");
        });

        it("should return immediately if already processed on first retrieve", async () => {
            const createResponse: Extend.ClassifyRunsCreateResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ClassifyRunsRetrieveResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
                classifier: { id: "classifier_123" },
            });

            expect(result.classifyRun.status).toBe("PROCESSED");
            expect(mockRetrieve).toHaveBeenCalledTimes(1);
        });

        it("should handle FAILED status as terminal", async () => {
            const createResponse: Extend.ClassifyRunsCreateResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ClassifyRunsRetrieveResponse = {
                classifyRun: createMockClassifyRun({ status: "FAILED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
                classifier: { id: "classifier_123" },
            });

            expect(result.classifyRun.status).toBe("FAILED");
        });

        it("should handle CANCELLED status as terminal", async () => {
            const createResponse: Extend.ClassifyRunsCreateResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ClassifyRunsRetrieveResponse = {
                classifyRun: createMockClassifyRun({ status: "CANCELLED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
                classifier: { id: "classifier_123" },
            });

            expect(result.classifyRun.status).toBe("CANCELLED");
        });

        it("should throw PollingTimeoutError when timeout exceeded", async () => {
            const createResponse: Extend.ClassifyRunsCreateResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ClassifyRunsRetrieveResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSING" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            await expect(
                wrapper.createAndPoll(
                    {
                        file: { url: "https://example.com/doc.pdf" },
                        classifier: { id: "classifier_123" },
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
            const createResponse: Extend.ClassifyRunsCreateResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ClassifyRunsRetrieveResponse = {
                classifyRun: createMockClassifyRun({ status: "PROCESSED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const requestOptions = { timeoutInSeconds: 30 };

            await wrapper.createAndPoll(
                {
                    file: { url: "https://example.com/doc.pdf" },
                    classifier: { id: "classifier_123" },
                },
                { requestOptions },
            );

            expect(mockCreate).toHaveBeenCalledWith(expect.anything(), requestOptions);
            expect(mockRetrieve).toHaveBeenCalledWith(expect.anything(), requestOptions);
        });
    });
});
