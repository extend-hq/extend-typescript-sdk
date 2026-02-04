export abstract class RunFailedError extends Error {
    public abstract readonly runId: string;
    public abstract readonly failureReason: string | null;
    public abstract readonly failureMessage: string | null;

    constructor(message: string) {
        super(message);
        this.name = "RunFailedError";
        Object.setPrototypeOf(this, RunFailedError.prototype);
    }
}
