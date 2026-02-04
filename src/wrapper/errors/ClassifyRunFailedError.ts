import type { ClassifyRunsRetrieveResponse } from "../../api";
import { RunFailedError } from "./RunFailedError";

export class ClassifyRunFailedError extends RunFailedError {
    public readonly response: ClassifyRunsRetrieveResponse;
    public readonly runId: string;
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;

    constructor(response: ClassifyRunsRetrieveResponse) {
        const reason = response.classifyRun.failureReason ?? "UNKNOWN";
        super(`Classify run failed: ${reason}`);

        this.response = response;
        this.runId = response.classifyRun.id;
        this.failureReason = response.classifyRun.failureReason;
        this.failureMessage = response.classifyRun.failureMessage;
        this.name = "ClassifyRunFailedError";
        Object.setPrototypeOf(this, ClassifyRunFailedError.prototype);
    }
}
