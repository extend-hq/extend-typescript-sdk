import type { SplitRunsRetrieveResponse } from "../../api";
import { RunFailedError } from "./RunFailedError";

export class SplitRunFailedError extends RunFailedError {
    public readonly response: SplitRunsRetrieveResponse;
    public readonly runId: string;
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;

    constructor(response: SplitRunsRetrieveResponse) {
        const reason = response.splitRun.failureReason ?? "UNKNOWN";
        super(`Split run failed: ${reason}`);

        this.response = response;
        this.runId = response.splitRun.id;
        this.failureReason = response.splitRun.failureReason;
        this.failureMessage = response.splitRun.failureMessage;
        this.name = "SplitRunFailedError";
        Object.setPrototypeOf(this, SplitRunFailedError.prototype);
    }
}
