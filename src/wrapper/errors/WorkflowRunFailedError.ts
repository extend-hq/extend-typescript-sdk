import type { WorkflowRunsRetrieveResponse } from "../../api";
import { RunFailedError } from "./RunFailedError";

export class WorkflowRunFailedError extends RunFailedError {
    public readonly response: WorkflowRunsRetrieveResponse;
    public readonly runId: string;
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;

    constructor(response: WorkflowRunsRetrieveResponse) {
        const reason = response.workflowRun.failureReason ?? "UNKNOWN";
        super(`Workflow run failed: ${reason}`);

        this.response = response;
        this.runId = response.workflowRun.id;
        this.failureReason = response.workflowRun.failureReason;
        this.failureMessage = response.workflowRun.failureMessage;
        this.name = "WorkflowRunFailedError";
        Object.setPrototypeOf(this, WorkflowRunFailedError.prototype);
    }
}
