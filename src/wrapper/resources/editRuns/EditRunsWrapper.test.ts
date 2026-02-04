import { EditRunsWrapper, PollingTimeoutError } from "./EditRunsWrapper";
import { EditRunFailedError } from "../../errors";
import * as Extend from "../../../api";

// ============================================================================
// Mock setup
// ============================================================================

const mockCreate = jest.fn();
const mockRetrieve = jest.fn();

jest.mock("../../../api/resources/editRuns/client/Client", () => ({
    EditRuns: jest.fn().mockImplementation(() => ({
        create: mockCreate,
        retrieve: mockRetrieve,
    })),
}));

// ============================================================================
// Test helpers
// ============================================================================

function createMockEditRun(overrides: Partial<Extend.EditRun> = {}): Extend.EditRun {
    return {
        object: "edit_run",
        id: "edit_run_test123",
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
        metrics: null,
        usage: null,
        ...overrides,
    };
}

// ============================================================================
// Tests
// ============================================================================

describe("EditRunsWrapper", () => {
    let wrapper: EditRunsWrapper;

    beforeEach(() => {
        jest.clearAllMocks();

        wrapper = Object.create(EditRunsWrapper.prototype);
        (wrapper as unknown as { create: typeof mockCreate }).create = mockCreate;
        (wrapper as unknown as { retrieve: typeof mockRetrieve }).retrieve = mockRetrieve;
    });

    describe("createAndPoll", () => {
        it("should create and poll until processed", async () => {
            const createResponse: Extend.EditRunsCreateResponse = {
                editRun: createMockEditRun({ status: "PROCESSING" }),
            };

            const retrieveResponse1: Extend.EditRunsRetrieveResponse = {
                editRun: createMockEditRun({ status: "PROCESSING" }),
            };

            const retrieveResponse2: Extend.EditRunsRetrieveResponse = {
                editRun: createMockEditRun({ status: "PROCESSED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValueOnce(retrieveResponse1).mockResolvedValueOnce(retrieveResponse2);

            const request: Extend.EditRunsCreateRequest = {
                file: { url: "https://example.com/doc.pdf" },
            };

            const result = await wrapper.createAndPoll(request, {
                initialDelayMs: 1,
                maxWaitMs: 10000,
                jitterFraction: 0,
            });

            expect(mockCreate).toHaveBeenCalledWith(request, undefined);
            expect(mockRetrieve).toHaveBeenCalledWith("edit_run_test123", undefined);
            expect(result.editRun.status).toBe("PROCESSED");
        });

        it("should return immediately if already processed on first retrieve", async () => {
            const createResponse: Extend.EditRunsCreateResponse = {
                editRun: createMockEditRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.EditRunsRetrieveResponse = {
                editRun: createMockEditRun({ status: "PROCESSED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
            });

            expect(result.editRun.status).toBe("PROCESSED");
            expect(mockRetrieve).toHaveBeenCalledTimes(1);
        });

        it("should handle FAILED status as terminal", async () => {
            const createResponse: Extend.EditRunsCreateResponse = {
                editRun: createMockEditRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.EditRunsRetrieveResponse = {
                editRun: createMockEditRun({ status: "FAILED" }),
            };

            mockCreate.mockResolvedValue(createResponse);
            mockRetrieve.mockResolvedValue(retrieveResponse);

            const result = await wrapper.createAndPoll({
                file: { url: "https://example.com/doc.pdf" },
            });

            expect(result.editRun.status).toBe("FAILED");
        });

        it("should throw PollingTimeoutError when timeout exceeded", async () => {
            const createResponse: Extend.EditRunsCreateResponse = {
                editRun: createMockEditRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.EditRunsRetrieveResponse = {
                editRun: createMockEditRun({ status: "PROCESSING" }),
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
            const createResponse: Extend.EditRunsCreateResponse = {
                editRun: createMockEditRun({ status: "PROCESSING" }),
            };

            const retrieveResponse: Extend.EditRunsRetrieveResponse = {
                editRun: createMockEditRun({ status: "PROCESSED" }),
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
            expect(mockRetrieve).toHaveBeenCalledWith(expect.anything(), requestOptions);
        });

        describe("with throwOnFailure", () => {
            it("should throw EditRunFailedError when status is FAILED and throwOnFailure is true", async () => {
                const createResponse: Extend.EditRunsCreateResponse = {
                    editRun: createMockEditRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.EditRunsRetrieveResponse = {
                    editRun: createMockEditRun({
                        status: "FAILED",
                        failureReason: "CORRUPT_FILE",
                        failureMessage: "File is corrupted",
                    }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                await expect(
                    wrapper.createAndPoll({ file: { url: "https://example.com/doc.pdf" } }, { throwOnFailure: true }),
                ).rejects.toThrow(EditRunFailedError);
            });

            it("should return response when status is FAILED and throwOnFailure is false", async () => {
                const createResponse: Extend.EditRunsCreateResponse = {
                    editRun: createMockEditRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.EditRunsRetrieveResponse = {
                    editRun: createMockEditRun({
                        status: "FAILED",
                        failureReason: "CORRUPT_FILE",
                        failureMessage: "File is corrupted",
                    }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                const result = await wrapper.createAndPoll(
                    { file: { url: "https://example.com/doc.pdf" } },
                    { throwOnFailure: false },
                );

                expect(result.editRun.status).toBe("FAILED");
            });

            it("should include full response in error", async () => {
                const createResponse: Extend.EditRunsCreateResponse = {
                    editRun: createMockEditRun({ status: "PROCESSING" }),
                };

                const retrieveResponse: Extend.EditRunsRetrieveResponse = {
                    editRun: createMockEditRun({
                        status: "FAILED",
                        failureReason: "CORRUPT_FILE",
                        failureMessage: "File is corrupted",
                    }),
                };

                mockCreate.mockResolvedValue(createResponse);
                mockRetrieve.mockResolvedValue(retrieveResponse);

                try {
                    await wrapper.createAndPoll(
                        { file: { url: "https://example.com/doc.pdf" } },
                        { throwOnFailure: true },
                    );
                } catch (error) {
                    expect(error).toBeInstanceOf(EditRunFailedError);
                    const failedError = error as EditRunFailedError;
                    expect(failedError.response).toBeDefined();
                    expect(failedError.runId).toBe("edit_run_test123");
                    expect(failedError.failureReason).toBe("CORRUPT_FILE");
                }
            });
        });
    });
});
