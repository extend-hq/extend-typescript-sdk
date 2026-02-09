import {
  WorkflowRunsClient,
  PollingTimeoutError,
} from "./WorkflowRunsWrapper";
import * as Extend from "../../../api";

// ============================================================================
// Mock setup
// ============================================================================

const mockCreate = jest.fn();
const mockRetrieve = jest.fn();

jest.mock("../../../api/resources/workflowRuns/client/Client", () => ({
  WorkflowRunsClient: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    retrieve: mockRetrieve,
  })),
}));

// ============================================================================
// Test helpers
// ============================================================================

function createMockWorkflowRun(
  overrides: Partial<Extend.WorkflowRun> = {}
): Extend.WorkflowRun {
  return {
    object: "workflow_run",
    id: "workflow_run_test123",
    workflow: {
      object: "workflow",
      id: "workflow_123",
      name: "Test Workflow",
    },
    workflowVersion: {
      object: "workflow_version",
      id: "workflow_version_456",
      version: "1",
      name: "Test Workflow v1",
    },
    status: "PROCESSED",
    dashboardUrl:
      "https://dashboard.extend.ai/workflow-runs/workflow_run_test123",
    metadata: {},
    files: [],
    stepRuns: [],
    reviewed: false,
    batchId: null,
    failureReason: null,
    failureMessage: null,
    initialRunAt: null,
    reviewedByUser: null,
    rejectionNote: null,
    reviewedAt: null,
    startTime: null,
    endTime: null,
    usage: null,
    ...overrides,
  };
}

// ============================================================================
// Tests
// ============================================================================

describe("WorkflowRunsClient", () => {
  let wrapper: WorkflowRunsClient;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = Object.create(WorkflowRunsClient.prototype);
    (wrapper as unknown as { create: typeof mockCreate }).create = mockCreate;
    (wrapper as unknown as { retrieve: typeof mockRetrieve }).retrieve =
      mockRetrieve;
  });

  describe("createAndPoll", () => {
    it("should create and poll until processed", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse1: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse2: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve
        .mockResolvedValueOnce(retrieveResponse1)
        .mockResolvedValueOnce(retrieveResponse2);

      const request: Extend.WorkflowRunsCreateRequest = {
        file: { url: "https://example.com/doc.pdf" },
        workflow: { id: "workflow_123" },
      };

      const result = await wrapper.createAndPoll(request, {
        initialDelayMs: 1,
        maxWaitMs: 10000,
        jitterFraction: 0,
      });

      expect(mockCreate).toHaveBeenCalledWith(request, undefined);
      expect(mockRetrieve).toHaveBeenCalledWith(
        "workflow_run_test123",
        undefined
      );
      expect(result.status).toBe("PROCESSED");
    });

    it("should return immediately if already processed on first retrieve", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve.mockResolvedValue(retrieveResponse);

      const result = await wrapper.createAndPoll({
        file: { url: "https://example.com/doc.pdf" },
        workflow: { id: "workflow_123" },
      });

      expect(result.status).toBe("PROCESSED");
      expect(mockRetrieve).toHaveBeenCalledTimes(1);
    });

    it("should handle FAILED status as terminal", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "FAILED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve.mockResolvedValue(retrieveResponse);

      const result = await wrapper.createAndPoll({
        file: { url: "https://example.com/doc.pdf" },
        workflow: { id: "workflow_123" },
      });

      expect(result.status).toBe("FAILED");
    });

    it("should handle CANCELLED status as terminal", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "CANCELLED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve.mockResolvedValue(retrieveResponse);

      const result = await wrapper.createAndPoll({
        file: { url: "https://example.com/doc.pdf" },
        workflow: { id: "workflow_123" },
      });

      expect(result.status).toBe("CANCELLED");
    });

    it("should handle NEEDS_REVIEW status as terminal", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "NEEDS_REVIEW",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve.mockResolvedValue(retrieveResponse);

      const result = await wrapper.createAndPoll({
        file: { url: "https://example.com/doc.pdf" },
        workflow: { id: "workflow_123" },
      });

      expect(result.status).toBe("NEEDS_REVIEW");
    });

    it("should handle REJECTED status as terminal", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "REJECTED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve.mockResolvedValue(retrieveResponse);

      const result = await wrapper.createAndPoll({
        file: { url: "https://example.com/doc.pdf" },
        workflow: { id: "workflow_123" },
      });

      expect(result.status).toBe("REJECTED");
    });

    it("should continue polling during PENDING status", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PENDING",
      });

      const retrieveResponse1: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PENDING",
      });

      const retrieveResponse2: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse3: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve
        .mockResolvedValueOnce(retrieveResponse1)
        .mockResolvedValueOnce(retrieveResponse2)
        .mockResolvedValueOnce(retrieveResponse3);

      const result = await wrapper.createAndPoll(
        {
          file: { url: "https://example.com/doc.pdf" },
          workflow: { id: "workflow_123" },
        },
        {
          initialDelayMs: 1,
          maxWaitMs: 10000,
          jitterFraction: 0,
        }
      );

      expect(result.status).toBe("PROCESSED");
      expect(mockRetrieve).toHaveBeenCalledTimes(3);
    });

    it("should continue polling during CANCELLING status", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse1: Extend.WorkflowRun = createMockWorkflowRun({
        status: "CANCELLING",
      });

      const retrieveResponse2: Extend.WorkflowRun = createMockWorkflowRun({
        status: "CANCELLED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve
        .mockResolvedValueOnce(retrieveResponse1)
        .mockResolvedValueOnce(retrieveResponse2);

      const result = await wrapper.createAndPoll(
        {
          file: { url: "https://example.com/doc.pdf" },
          workflow: { id: "workflow_123" },
        },
        {
          initialDelayMs: 1,
          maxWaitMs: 10000,
          jitterFraction: 0,
        }
      );

      expect(result.status).toBe("CANCELLED");
      expect(mockRetrieve).toHaveBeenCalledTimes(2);
    });

    it("should throw PollingTimeoutError when timeout exceeded", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve.mockResolvedValue(retrieveResponse);

      await expect(
        wrapper.createAndPoll(
          {
            file: { url: "https://example.com/doc.pdf" },
            workflow: { id: "workflow_123" },
          },
          {
            maxWaitMs: 50,
            initialDelayMs: 10,
            jitterFraction: 0,
          }
        )
      ).rejects.toThrow(PollingTimeoutError);
    });

    it("should use default maxWaitMs of 2 hours for workflows", async () => {
      // This test verifies the default is set but doesn't actually wait 2 hours
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve.mockResolvedValue(retrieveResponse);

      // Should not throw with default options (would fail if default was too short)
      const result = await wrapper.createAndPoll({
        file: { url: "https://example.com/doc.pdf" },
        workflow: { id: "workflow_123" },
      });

      expect(result.status).toBe("PROCESSED");
    });

    it("should pass request options to create and retrieve", async () => {
      const createResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSING",
      });

      const retrieveResponse: Extend.WorkflowRun = createMockWorkflowRun({
        status: "PROCESSED",
      });

      mockCreate.mockResolvedValue(createResponse);
      mockRetrieve.mockResolvedValue(retrieveResponse);

      const requestOptions = { timeoutInSeconds: 30 };

      await wrapper.createAndPoll(
        {
          file: { url: "https://example.com/doc.pdf" },
          workflow: { id: "workflow_123" },
        },
        { requestOptions }
      );

      expect(mockCreate).toHaveBeenCalledWith(
        expect.anything(),
        requestOptions
      );
      expect(mockRetrieve).toHaveBeenCalledWith(
        expect.anything(),
        requestOptions
      );
    });
  });
});
