import { SplitRunsWrapper, PollingTimeoutError } from "./SplitRunsWrapper";
import * as Extend from "../../../api";

// ============================================================================
// Mock setup
// ============================================================================

const mockCreate = jest.fn();
const mockRetrieve = jest.fn();

jest.mock("../../../api/resources/splitRuns/client/Client", () => ({
    SplitRunsClient: jest.fn().mockImplementation(() => ({
        create: mockCreate,
        retrieve: mockRetrieve,
    })),
}));

// ============================================================================
// Test helpers
// ============================================================================

function createMockSplitRun(overrides: Partial<Extend.SplitRun> = {}): Extend.SplitRun {
    return {
        object: "split_run",
        id: "split_run_test123",
        splitter: {
            object: "splitter",
            id: "splitter_123",
            name: "Test Splitter",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
        },
        splitterVersion: {
            object: "splitter_version",
            id: "splitter_version_456",
            version: "1",
            splitterId: "splitter_123",
            description: null,
            createdAt: "2024-01-01T00:00:00Z",
        },
        status: "PROCESSED",
        output: { splits: [] },
        initialOutput: { splits: [] },
        reviewedOutput: { splits: [] },
        metadata: {},
        reviewed: false,
        edited: false,
        config: { splitClassifications: [] },
        file: {
            object: "file",
            id: "file_789",
            name: "test.pdf",
            type: "PDF",
            parentFileId: null,
            metadata: {},
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
        },
        dashboardUrl: "https://dashboard.extend.ai/split-runs/split_run_test123",
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

describe("SplitRunsWrapper", () => {
    let wrapper: SplitRunsWrapper;

    beforeEach(() => {
        jest.clearAllMocks();

        wrapper = Object.create(SplitRunsWrapper.prototype);
        (wrapper as unknown as { create: typeof mockCreate }).create = mockCreate;
        (wrapper as unknown as { retrieve: typeof mockRetrieve }).retrieve = mockRetrieve;
    });

    describe("createAndPoll", () => {
        it("should create and poll until processed", async () => {
            const createResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSING" });

            const retrieveResponse1: Extend.SplitRun = createMockSplitRun({ status: "PROCESSING" });

            const retrieveResponse2: Extend.SplitRun = createMockSplitRun({ status: "PROCESSED" });

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValueOnce(retrieveResponse1).mockResolvedValueOnce(retrieveResponse2);

            const request: Extend.SplitRunsCreateRequest = {
                file: { url: "https://example.com/doc.pdf" },
                splitter: { id: "splitter_123" },
            };

            const result = await wrapper.createAndPoll(request, {
                initialDelayMs: 1,
                maxWaitMs: 10000,
                jitterFraction: 0,
            });

            expect(mockCreate).toHaveBeenCalledWith(request, undefined);
            expect(mockRetrieve).toHaveBeenCalledWith("split_run_test123", undefined);
            expect(result.status).toBe("PROCESSED");
        });

        it("should return immediately if already processed on first retrieve", async () => {
            const createResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSING" });

            const retrieveResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSED" });

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
                splitter: { id: "splitter_123" },
            });

            expect(result.status).toBe("PROCESSED");
            expect(mockRetrieve).toHaveBeenCalledTimes(1);
        });

        it("should handle FAILED status as terminal", async () => {
            const createResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSING" });

            const retrieveResponse: Extend.SplitRun = createMockSplitRun({ status: "FAILED" });

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
                splitter: { id: "splitter_123" },
            });

            expect(result.status).toBe("FAILED");
        });

        it("should handle CANCELLED status as terminal", async () => {
            const createResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSING" });

            const retrieveResponse: Extend.SplitRun = createMockSplitRun({ status: "CANCELLED" });

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
                splitter: { id: "splitter_123" },
            });

            expect(result.status).toBe("CANCELLED");
        });

        it("should throw PollingTimeoutError when timeout exceeded", async () => {
            const createResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSING" });

            const retrieveResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSING" });

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            await expect(
                wrapper.createAndPoll(
                    {
                        file: { url: "https://example.com/doc.pdf" },
                        splitter: { id: "splitter_123" },
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
            const createResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSING" });

            const retrieveResponse: Extend.SplitRun = createMockSplitRun({ status: "PROCESSED" });

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const requestOptions = { timeoutInSeconds: 30 };

            await wrapper.createAndPoll(
                {
                    file: { url: "https://example.com/doc.pdf" },
                    splitter: { id: "splitter_123" },
                },
                { requestOptions },
            );

            expect(mockCreate).toHaveBeenCalledWith(expect.anything(), requestOptions);
            expect(mockRetrieve).toHaveBeenCalledWith(expect.anything(), requestOptions);
        });
    });
});
