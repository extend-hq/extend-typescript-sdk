import type { ExtractRunsRetrieveResponse } from "../../api";
import { RunFailedError } from "./RunFailedError";

export class ExtractRunFailedError extends RunFailedError {
    public readonly response: ExtractRunsRetrieveResponse;
    public readonly runId: string;
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;

    constructor(response: ExtractRunsRetrieveResponse) {
        const reason = response.extractRun.failureReason ?? "UNKNOWN";
        super(`Extract run failed: ${reason}`);

        this.response = response;
        this.runId = response.extractRun.id;
        this.failureReason = response.extractRun.failureReason;
        this.failureMessage = response.extractRun.failureMessage;
        this.name = "ExtractRunFailedError";
        Object.setPrototypeOf(this, ExtractRunFailedError.prototype);
    }
}
