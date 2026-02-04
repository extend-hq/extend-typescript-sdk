# Error Handling Comparison: Throwing vs Returning

This document compares two approaches for handling failed runs in the SDK's `createAndPoll` methods.

---

## Two Types of Errors: API vs Job Failures

When using `createAndPoll`, there are two fundamentally different types of failures:

### Error Flow Diagram

```
createAndPoll() flow:

  1. create()  →  POST /parse_runs
     ├─ HTTP 400  →  throws BadRequestError      ← API FAILURE
     ├─ HTTP 401  →  throws UnauthorizedError    ← API FAILURE
     ├─ HTTP 402  →  throws PaymentRequiredError ← API FAILURE
     ├─ HTTP 500  →  throws InternalServerError  ← API FAILURE
     └─ HTTP 200  →  { parseRun: { status: "PROCESSING" } }

  2. poll loop  →  GET /parse_runs/:id (repeated)
     ├─ HTTP 4xx/5xx  →  throws existing errors  ← API FAILURE
     └─ HTTP 200      →  check status...

  3. Terminal status reached
     ├─ status: "PROCESSED"  →  return response  ← SUCCESS
     └─ status: "FAILED"     →  ???              ← JOB FAILURE
```

### API Failures (HTTP Errors)

These happen when the **HTTP request itself fails**. The SDK already throws specific error classes for these:

| Error Class                | HTTP Status | Cause                                  |
| -------------------------- | ----------- | -------------------------------------- |
| `BadRequestError`          | 400         | Invalid request parameters             |
| `UnauthorizedError`        | 401         | Invalid or missing API key             |
| `PaymentRequiredError`     | 402         | Insufficient credits (at request time) |
| `NotFoundError`            | 404         | Resource doesn't exist                 |
| `UnprocessableEntityError` | 422         | Request validation failed              |
| `InternalServerError`      | 500         | Server error                           |

**Error body structure:** `{ code, message, requestId, retryable }`

### Job Failures (Processing Errors)

These happen when the **API calls succeed but the document processing fails**. The run reaches a terminal `FAILED` status.

| Property         | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `failureReason`  | Error code: `CORRUPT_FILE`, `OCR_ERROR`, `INTERNAL_ERROR`, etc. |
| `failureMessage` | Human-readable description                                      |

**Key difference:** The HTTP response is 200 OK, but `status === "FAILED"`.

### Different Class Hierarchies

```typescript
// Existing SDK errors (HTTP/API failures)
class ExtendError extends Error { ... }
class BadRequestError extends ExtendError { ... }     // 400
class UnauthorizedError extends ExtendError { ... }   // 401
class PaymentRequiredError extends ExtendError { ... } // 402
class InternalServerError extends ExtendError { ... } // 500

// New errors (Job/Processing failures)
class RunFailedError extends Error { ... }            // Base for all run failures
class ParseRunFailedError extends RunFailedError { ... }
class ExtractRunFailedError extends RunFailedError { ... }
// etc.
```

### Complete Error Handling Example

```typescript
import * as Extend from "extend-ai";
import { ParseRunFailedError, RunFailedError } from "extend-ai";

try {
  const result = await client.parseRuns.createAndPoll(
    { file: { url } },
    { throwOnFailure: true }
  );
  console.log(result.parseRun.output);

} catch (error) {
  // ═══════════════════════════════════════════════════════════════
  // JOB/PROCESSING FAILURES - API succeeded, but document processing failed
  // ═══════════════════════════════════════════════════════════════
  if (error instanceof ParseRunFailedError) {
    console.log("Job failed:", error.failureReason);
    console.log("Message:", error.failureMessage);
    console.log("Run ID:", error.runId);

    // Full response still available
    console.log("File:", error.response.parseRun.file.name);

    // Retryable failures (user-defined)
    if (error.failureReason === "OCR_ERROR" || error.failureReason === "INTERNAL_ERROR") {
      return retry(() => client.parseRuns.createAndPoll(...));
    }

    // Non-retryable failures
    switch (error.failureReason) {
      case "CORRUPT_FILE":
      case "PASSWORD_PROTECTED_FILE":
        throw new UserError(`Cannot process file: ${error.failureMessage}`);
      case "FILE_TYPE_NOT_SUPPORTED":
      case "FILE_SIZE_TOO_LARGE":
        throw new ValidationError(error.failureMessage);
      case "OUT_OF_CREDITS":
        throw new BillingError("Insufficient credits");
      default:
        throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // API FAILURES - HTTP request itself failed
  // ═══════════════════════════════════════════════════════════════
  if (error instanceof Extend.BadRequestError) {
    // Invalid request parameters
    console.log("Bad request:", error.body?.code);
    throw new ValidationError(error.body?.message);
  }

  if (error instanceof Extend.UnauthorizedError) {
    // Auth problem - check API key
    throw new AuthError("Invalid API key");
  }

  if (error instanceof Extend.PaymentRequiredError) {
    // Out of credits before job even started
    throw new BillingError("Insufficient credits");
  }

  if (error instanceof Extend.InternalServerError) {
    // Server error - might be transient
    if (error.body?.retryable) {
      return retry(() => client.parseRuns.createAndPoll(...));
    }
    throw new ServiceError("Extend API unavailable");
  }

  // Network errors, timeouts, etc.
  throw error;
}
```

---

## Approach 1: Return Response (Current Behavior)

The SDK returns the response regardless of status. Users must check the status manually.

### Simple Usage

```typescript
const result = await client.parseRuns.createAndPoll({
    file: { url: "https://example.com/document.pdf" },
});

if (result.parseRun.status === "PROCESSED") {
    console.log(result.parseRun.output);
} else if (result.parseRun.status === "FAILED") {
    console.error(`Failed: ${result.parseRun.failureReason}`);
}
```

### With Error Code Handling

```typescript
const result = await client.parseRuns.createAndPoll({
    file: { url: "https://example.com/document.pdf" },
});

if (result.parseRun.status === "PROCESSED") {
    return processOutput(result.parseRun.output);
}

// Handle specific failure reasons
const { failureReason, failureMessage } = result.parseRun;

switch (failureReason) {
    case "CORRUPT_FILE":
    case "PASSWORD_PROTECTED_FILE":
        // User error - notify them
        throw new UserFacingError(`Cannot process file: ${failureMessage}`);

    case "FILE_TYPE_NOT_SUPPORTED":
    case "FILE_SIZE_TOO_LARGE":
        // Validation error - reject the file
        throw new ValidationError(failureMessage);

    case "OCR_ERROR":
    case "INTERNAL_ERROR":
        // Retryable - attempt again
        return retry(() => client.parseRuns.createAndPoll({ file: { url } }));

    case "OUT_OF_CREDITS":
        // Billing issue
        throw new BillingError("Insufficient credits");

    default:
        // Unknown error - log and fail gracefully
        logger.error("Unknown parse failure", { failureReason, failureMessage });
        throw new Error(`Parse failed: ${failureMessage}`);
}
```

### Processing Multiple Files

```typescript
async function parseFiles(urls: string[]) {
    const results = await Promise.all(urls.map((url) => client.parseRuns.createAndPoll({ file: { url } })));

    const successful = results.filter((r) => r.parseRun.status === "PROCESSED");
    const failed = results.filter((r) => r.parseRun.status === "FAILED");

    // Must remember to check for failures
    if (failed.length > 0) {
        console.error(`${failed.length} files failed to process`);
        for (const f of failed) {
            console.error(`  - ${f.parseRun.file.name}: ${f.parseRun.failureReason}`);
        }
    }

    return successful.map((r) => r.parseRun.output);
}
```

### Pros

- Full response always available
- Easy to collect both successes and failures in batch operations
- No try/catch needed for expected failures

### Cons

- Easy to forget status check → silent failures
- Verbose boilerplate for simple "just give me the result" cases
- Must repeat status check pattern everywhere

---

## Approach 2: Throw Error (With `throwOnFailure` Option)

The SDK throws an `ExtendRunFailedError` when status is `FAILED`. The error includes the full response.

### Simple Usage

```typescript
try {
    const result = await client.parseRuns.createAndPoll(
        { file: { url: "https://example.com/document.pdf" } },
        { throwOnFailure: true },
    );
    // Guaranteed to be PROCESSED if we reach here
    console.log(result.parseRun.output);
} catch (error) {
    if (error instanceof ExtendRunFailedError) {
        console.error(`Failed: ${error.failureReason}`);
    } else {
        throw error; // Re-throw unexpected errors
    }
}
```

### With Error Code Handling

```typescript
try {
    const result = await client.parseRuns.createAndPoll(
        { file: { url: "https://example.com/document.pdf" } },
        { throwOnFailure: true },
    );
    return processOutput(result.parseRun.output);
} catch (error) {
    if (!(error instanceof ExtendRunFailedError)) {
        throw error; // Network errors, etc.
    }

    // Handle specific failure reasons
    switch (error.failureReason) {
        case "CORRUPT_FILE":
        case "PASSWORD_PROTECTED_FILE":
            throw new UserFacingError(`Cannot process file: ${error.failureMessage}`);

        case "FILE_TYPE_NOT_SUPPORTED":
        case "FILE_SIZE_TOO_LARGE":
            throw new ValidationError(error.failureMessage);

        case "OCR_ERROR":
        case "INTERNAL_ERROR":
            return retry(() => client.parseRuns.createAndPoll({ file: { url } }, { throwOnFailure: true }));

        case "OUT_OF_CREDITS":
            throw new BillingError("Insufficient credits");

        default:
            logger.error("Unknown parse failure", {
                failureReason: error.failureReason,
                runId: error.runId,
            });
            throw error;
    }
}
```

### Processing Multiple Files (With `Promise.allSettled`)

```typescript
async function parseFiles(urls: string[]) {
    const results = await Promise.allSettled(
        urls.map((url) => client.parseRuns.createAndPoll({ file: { url } }, { throwOnFailure: true })),
    );

    const successful = results
        .filter((r): r is PromiseFulfilledResult<ParseRunsRetrieveResponse> => r.status === "fulfilled")
        .map((r) => r.value.parseRun.output);

    const failed = results
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r) => r.reason as ExtendRunFailedError);

    if (failed.length > 0) {
        console.error(`${failed.length} files failed to process`);
        for (const error of failed) {
            // Full response still available on the error
            console.error(`  - ${error.response.parseRun.file.name}: ${error.failureReason}`);
        }
    }

    return successful;
}
```

### Happy Path (No Error Handling Needed)

When failures should just propagate up:

```typescript
// Clean one-liner for simple scripts
const result = await client.parseRuns.createAndPoll({ file: { url } }, { throwOnFailure: true });
console.log(result.parseRun.output);
```

### Pros

- Can't accidentally ignore failures
- Clean happy path - no boilerplate for simple cases
- Matches `client.parse()` error behavior (consistency)
- Standard JavaScript error handling patterns

### Cons

- Must use `Promise.allSettled` for batch operations
- Slightly more verbose for "collect all results" patterns
- Requires understanding of the error class

---

## The `ExtendRunFailedError` Class

```typescript
import * as Extend from "extend-ai";

export class ExtendRunFailedError extends Error {
    public readonly name = "ExtendRunFailedError";

    /** The full response - no information is lost */
    public readonly response: Extend.ParseRunsRetrieveResponse;

    /** Convenience: The run ID */
    public readonly runId: string;

    /** Convenience: The failure reason code */
    public readonly failureReason: string | null;

    /** Convenience: Human-readable failure message */
    public readonly failureMessage: string | null;

    constructor(response: Extend.ParseRunsRetrieveResponse) {
        const reason = response.parseRun.failureReason ?? "UNKNOWN";
        super(`Parse run failed: ${reason}`);

        this.response = response;
        this.runId = response.parseRun.id;
        this.failureReason = response.parseRun.failureReason;
        this.failureMessage = response.parseRun.failureMessage;

        Object.setPrototypeOf(this, ExtendRunFailedError.prototype);
    }
}
```

---

## Multi-Resource Error Class Design

All 6 run types share the same failure pattern:

| Run Type    | Response Property | Status Type          |
| ----------- | ----------------- | -------------------- |
| ParseRun    | `parseRun`        | `ParseRunStatusEnum` |
| ExtractRun  | `extractRun`      | `ProcessorRunStatus` |
| ClassifyRun | `classifyRun`     | `ProcessorRunStatus` |
| SplitRun    | `splitRun`        | `ProcessorRunStatus` |
| EditRun     | `editRun`         | `EditRunStatus`      |
| WorkflowRun | `workflowRun`     | `WorkflowRunStatus`  |

All have: `id`, `failureReason: string | null`, `failureMessage: string | null`

---

### Option A: One Error Class Per Resource (6 classes)

```typescript
// errors/ParseRunFailedError.ts
export class ParseRunFailedError extends Error {
    public readonly response: ParseRunsRetrieveResponse;
    public readonly runId: string;
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;
    constructor(response: ParseRunsRetrieveResponse) {
        super(`Parse run failed: ${response.parseRun.failureReason}`);
        this.response = response;
        this.runId = response.parseRun.id;
        this.failureReason = response.parseRun.failureReason;
        this.failureMessage = response.parseRun.failureMessage;
    }
}

// errors/ExtractRunFailedError.ts
export class ExtractRunFailedError extends Error {
    public readonly response: ExtractRunsRetrieveResponse;
    // ... same pattern
}

// ... 4 more classes
```

**User code:**

```typescript
try {
    await client.parseRuns.createAndPoll({ file: { url } }, { throwOnFailure: true });
} catch (error) {
    if (error instanceof ParseRunFailedError) {
        // TypeScript knows error.response is ParseRunsRetrieveResponse
    }
}
```

**Pros:**

- Full type safety - each error knows its exact response type
- IDE autocomplete works perfectly
- Easy to catch specific run types

**Cons:**

- 6 nearly identical classes (boilerplate)
- Can't easily catch "any run failure" without multiple checks

---

### Option B: Single Generic Error Class

```typescript
// errors/RunFailedError.ts
export class RunFailedError<TResponse> extends Error {
    public readonly response: TResponse;
    public readonly runId: string;
    public readonly runType: "parse" | "extract" | "classify" | "split" | "edit" | "workflow";
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;

    constructor(
        response: TResponse,
        run: { id: string; failureReason: string | null; failureMessage: string | null },
        runType: "parse" | "extract" | "classify" | "split" | "edit" | "workflow",
    ) {
        super(`${runType} run failed: ${run.failureReason}`);
        this.response = response;
        this.runId = run.id;
        this.runType = runType;
        this.failureReason = run.failureReason;
        this.failureMessage = run.failureMessage;
    }
}
```

**User code:**

```typescript
try {
    await client.parseRuns.createAndPoll({ file: { url } }, { throwOnFailure: true });
} catch (error) {
    if (error instanceof RunFailedError) {
        // error.response is TResponse (generic) - less specific
        // Need type guard for full type safety:
        if (error.runType === "parse") {
            const parseResponse = error.response as ParseRunsRetrieveResponse;
        }
    }
}
```

**Pros:**

- Single class to maintain
- Easy to catch any run failure with one check

**Cons:**

- Generic type `TResponse` is less useful at runtime
- Need type guards for full response type safety

---

### Option C: Base Class + Specific Subclasses (Recommended)

```typescript
// errors/RunFailedError.ts

/** Base class for all run failures - catch this to handle any run type */
export abstract class RunFailedError extends Error {
    public abstract readonly runId: string;
    public abstract readonly failureReason: string | null;
    public abstract readonly failureMessage: string | null;
}

// errors/ParseRunFailedError.ts
export class ParseRunFailedError extends RunFailedError {
    public readonly response: ParseRunsRetrieveResponse;
    public readonly runId: string;
    public readonly failureReason: string | null;
    public readonly failureMessage: string | null;

    constructor(response: ParseRunsRetrieveResponse) {
        super(`Parse run failed: ${response.parseRun.failureReason}`);
        this.response = response;
        this.runId = response.parseRun.id;
        this.failureReason = response.parseRun.failureReason;
        this.failureMessage = response.parseRun.failureMessage;
    }
}

// errors/ExtractRunFailedError.ts
export class ExtractRunFailedError extends RunFailedError {
    public readonly response: ExtractRunsRetrieveResponse;
    // ...
}

// ... other subclasses
```

**User code:**

```typescript
// Catch ANY run failure
try {
    await client.parseRuns.createAndPoll({ file: { url } }, { throwOnFailure: true });
    await client.extractRuns.createAndPoll({ file: { url }, extractor: "..." }, { throwOnFailure: true });
} catch (error) {
    if (error instanceof RunFailedError) {
        // Works for all run types!
        console.log(error.failureReason);
    }
}

// Catch SPECIFIC run failure
try {
    await client.parseRuns.createAndPoll({ file: { url } }, { throwOnFailure: true });
} catch (error) {
    if (error instanceof ParseRunFailedError) {
        // Full type safety - error.response is ParseRunsRetrieveResponse
        console.log(error.response.parseRun.config);
    }
}

// Mix and match
try {
    // ...
} catch (error) {
    if (error instanceof ParseRunFailedError) {
        // Handle parse-specific
    } else if (error instanceof RunFailedError) {
        // Handle any other run failure generically
    }
}
```

**Pros:**

- Full type safety for each specific error
- Single `instanceof RunFailedError` catches all
- Common properties accessible on base class
- Best of both worlds

**Cons:**

- More classes to maintain (but can share logic via helpers)

---

## Recommendation

**Option C: Base Class + Subclasses** with `throwOnFailure: false` as default.

```typescript
// Can catch everything
if (error instanceof RunFailedError) {
    /* ... */
}

// Or catch specific types
if (error instanceof ParseRunFailedError) {
    /* ... */
}
if (error instanceof ExtractRunFailedError) {
    /* ... */
}

// Default behavior (backward compatible)
const result = await client.parseRuns.createAndPoll({ file: { url } });
if (result.parseRun.status === "FAILED") {
    /* handle */
}

// Opt-in throwing behavior
const result = await client.parseRuns.createAndPoll({ file: { url } }, { throwOnFailure: true });
// Guaranteed success
```

This gives users:

- **Flexibility**: Catch all or catch specific
- **Type safety**: Full response types when catching specific errors
- **Consistency**: Common interface across all run types
- **Backward compatibility**: Default doesn't throw

---

## Quick Reference: Error Handling Cheat Sheet

### Error Type Summary

| Error Type                 | When Thrown                  | Base Class       | Key Properties                                |
| -------------------------- | ---------------------------- | ---------------- | --------------------------------------------- |
| `BadRequestError`          | HTTP 400                     | `ExtendError`    | `body.code`, `body.message`, `body.retryable` |
| `UnauthorizedError`        | HTTP 401                     | `ExtendError`    | `body.code`, `body.message`                   |
| `PaymentRequiredError`     | HTTP 402                     | `ExtendError`    | `body.code`, `body.message`                   |
| `NotFoundError`            | HTTP 404                     | `ExtendError`    | `body.code`, `body.message`                   |
| `UnprocessableEntityError` | HTTP 422                     | `ExtendError`    | `body.code`, `body.message`                   |
| `InternalServerError`      | HTTP 500                     | `ExtendError`    | `body.code`, `body.message`, `body.retryable` |
| `PollingTimeoutError`      | Polling exceeded `maxWaitMs` | `Error`          | `message`                                     |
| `ParseRunFailedError`      | `status === "FAILED"`        | `RunFailedError` | `failureReason`, `failureMessage`, `response` |
| `ExtractRunFailedError`    | `status === "FAILED"`        | `RunFailedError` | `failureReason`, `failureMessage`, `response` |
| ... other run errors       | `status === "FAILED"`        | `RunFailedError` | (same pattern)                                |

### Catch Patterns

```typescript
// Catch ALL errors from createAndPoll
try {
  await client.parseRuns.createAndPoll({ ... }, { throwOnFailure: true });
} catch (error) {
  if (error instanceof RunFailedError) {
    // Any job failure (parse, extract, classify, split, edit, workflow)
  } else if (error instanceof Extend.ExtendError) {
    // Any API/HTTP error (400, 401, 500, etc.)
  } else if (error instanceof PollingTimeoutError) {
    // Polling timed out
  } else {
    // Network error, etc.
  }
}
```

### Retryable Errors

**API errors (check `error.body.retryable`):**

- Some `InternalServerError` responses

**Job failures (check `error.failureReason`):**

- `OCR_ERROR` - OCR service temporarily failed
- `INTERNAL_ERROR` - Internal processing error

### Decision Tree

```
Is it an API error (ExtendError)?
├─ Yes → Check error.body.code and error.body.retryable
│        └─ Retry if retryable, otherwise fail fast
│
└─ No → Is it a job failure (RunFailedError)?
        ├─ Yes → Check error.failureReason
        │        ├─ OCR_ERROR / INTERNAL_ERROR? → Retry the createAndPoll call
        │        └─ Otherwise → User error or permanent failure
        │
        └─ No → Is it PollingTimeoutError?
                ├─ Yes → Job still running, increase maxWaitMs or poll manually
                └─ No → Network error, unknown error
```
