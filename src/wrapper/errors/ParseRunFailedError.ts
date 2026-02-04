import type { ParseRunsRetrieveResponse } from "../../api";
import { RunFailedError } from "./RunFailedError";

export class ParseRunFailedError extends RunFailedError {
    public readonly response: ParseRunsRetrieveResponse;
    public readonly runId: string;
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;

    constructor(response: ParseRunsRetrieveResponse) {
        const reason = response.parseRun.failureReason ?? "UNKNOWN";
        super(`Parse run failed: ${reason}`);

        this.response = response;
        this.runId = response.parseRun.id;
        this.failureReason = response.parseRun.failureReason;
        this.failureMessage = response.parseRun.failureMessage;
        this.name = "ParseRunFailedError";
        Object.setPrototypeOf(this, ParseRunFailedError.prototype);
    }
}
