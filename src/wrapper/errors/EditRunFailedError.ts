import type { EditRunsRetrieveResponse } from "../../api";
import { RunFailedError } from "./RunFailedError";

export class EditRunFailedError extends RunFailedError {
    public readonly response: EditRunsRetrieveResponse;
    public readonly runId: string;
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;

    constructor(response: EditRunsRetrieveResponse) {
        const reason = response.editRun.failureReason ?? "UNKNOWN";
        super(`Edit run failed: ${reason}`);

        this.response = response;
        this.runId = response.editRun.id;
        this.failureReason = response.editRun.failureReason;
        this.failureMessage = response.editRun.failureMessage;
        this.name = "EditRunFailedError";
        Object.setPrototypeOf(this, EditRunFailedError.prototype);
    }
}
