import { ParseRunsWrapper, PollingTimeoutError } from "./ParseRunsWrapper";
import * as Extend from "../../../api";

// ============================================================================
// Mock setup
// ============================================================================

const mockCreate = jest.fn();
const mockRetrieve = jest.fn();

jest.mock("../../../api/resources/parseRuns/client/Client", () => ({
    ParseRuns: jest.fn().mockImplementation(() => ({
        create: mockCreate,
        retrieve: mockRetrieve,
    })),
}));

// ============================================================================
// Test helpers
// ============================================================================

function createMockParseRun(overrides: Partial<Extend.ParseRun> = {}): Extend.ParseRun {
    return {
        object: "parse_run",
        id: "parse_run_test123",
        status: "PROCESSED",
        config: {},
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
        failureReason: null,
        failureMessage: null,
        output: null,
        outputUrl: null,
        metrics: null,
        usage: null,
        ...overrides,
    };
}

// ============================================================================
// Tests
// ============================================================================

describe("ParseRunsWrapper", () => {
    let wrapper: ParseRunsWrapper;

    beforeEach(() => {
        jest.clearAllMocks();

        wrapper = Object.create(ParseRunsWrapper.prototype);
        (wrapper as unknown as { create: typeof mockCreate }).create = mockCreate;
        (wrapper as unknown as { retrieve: typeof mockRetrieve }).retrieve = mockRetrieve;
    });

    describe("createAndPoll", () => {
        it("should create and poll until processed", async () => {
            const createResponse: Extend.ParseRunsCreateResponse = {
                parseRun: createMockParseRun({ status: "PROCESSING" }),
            };

            const retrieveResponse1: Extend.ParseRunsRetrieveResponse = {
                parseRun: createMockParseRun({ status: "PROCESSING" }),
            };

            const retrieveResponse2: Extend.ParseRunsRetrieveResponse = {
                parseRun: createMockParseRun({ status: "PROCESSED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValueOnce(retrieveResponse1).mockResolvedValueOnce(retrieveResponse2);

            const request: Extend.ParseRunsCreateRequest = {
                file: { url: "https://example.com/doc.pdf" },
            };

            const result = await wrapper.createAndPoll(request, {
                initialDelayMs: 1,
                maxWaitMs: 10000,
                jitterFraction: 0,
            });

            expect(mockCreate).toHaveBeenCalledWith(request, undefined);
            expect(mockRetrieve).toHaveBeenCalledWith("parse_run_test123", {}, undefined);
            expect(result.parseRun.status).toBe("PROCESSED");
        });

        it("should return immediately if already processed on first retrieve", async () => {
            const createResponse: Extend.ParseRunsCreateResponse = {
                parseRun: createMockParseRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ParseRunsRetrieveResponse = {
                parseRun: createMockParseRun({ status: "PROCESSED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
            });

            expect(result.parseRun.status).toBe("PROCESSED");
            expect(mockRetrieve).toHaveBeenCalledTimes(1);
        });

        it("should handle FAILED status as terminal", async () => {
            const createResponse: Extend.ParseRunsCreateResponse = {
                parseRun: createMockParseRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ParseRunsRetrieveResponse = {
                parseRun: createMockParseRun({ status: "FAILED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
            });

            expect(result.parseRun.status).toBe("FAILED");
        });

        it("should throw PollingTimeoutError when timeout exceeded", async () => {
            const createResponse: Extend.ParseRunsCreateResponse = {
                parseRun: createMockParseRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ParseRunsRetrieveResponse = {
                parseRun: createMockParseRun({ status: "PROCESSING" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            await expect(
                wrapper.createAndPoll(
                    {
                        file: { url: "https://example.com/doc.pdf" },
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
            const createResponse: Extend.ParseRunsCreateResponse = {
                parseRun: createMockParseRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.ParseRunsRetrieveResponse = {
                parseRun: createMockParseRun({ status: "PROCESSED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const requestOptions = { timeoutInSeconds: 30 };

            await wrapper.createAndPoll(
                {
                    file: { url: "https://example.com/doc.pdf" },
                },
                { requestOptions },
            );

            expect(mockCreate).toHaveBeenCalledWith(expect.anything(), requestOptions);
            expect(mockRetrieve).toHaveBeenCalledWith(expect.anything(), {}, requestOptions);
        });
    });
});
