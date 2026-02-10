# Extend TypeScript Library

[![npm version](https://img.shields.io/npm/v/extend-ai.svg)](https://www.npmjs.com/package/extend-ai)
[![Node.js](https://img.shields.io/node/v/extend-ai.svg)](https://www.npmjs.com/package/extend-ai)

The Extend TypeScript library provides convenient, fully typed access to the [Extend API](https://docs.extend.ai/2026-02-09/developers) — enabling you to parse, extract, classify, split, and edit documents with a few lines of code.

## Installation

```sh
npm i -s extend-ai
```

> Requires Node.js 18+. Also works on Vercel, Cloudflare Workers, Deno v1.25+, Bun 1.0+, and React Native.

## Quick start

Parse any document in three lines:

```typescript
import { ExtendClient } from "extend-ai";

const client = new ExtendClient({ token: "YOUR_API_KEY" });

const result = await client.parse({ file: { url: "https://example.com/invoice.pdf" } });

for (const chunk of result.output.chunks) {
  console.log(chunk.content);
}
```

`client.parse` sends the file, waits for processing, and returns a fully populated `ParseRun` with parsed chunks ready to use. The same pattern works for every capability:

```typescript
// Extract structured data
const extractRun = await client.extract({
  file: { url: "https://example.com/invoice.pdf" },
  extractor: { id: "ex_abc123" },
});

// Classify a document
const classifyRun = await client.classify({
  file: { url: "https://example.com/document.pdf" },
  classifier: { id: "cls_abc123" },
});

// Split a multi-document file
const splitRun = await client.split({
  file: { url: "https://example.com/packet.pdf" },
  splitter: { id: "spl_abc123" },
});

// Fill form fields in a PDF
const editRun = await client.edit({
  file: { url: "https://example.com/form.pdf" },
  config: { fields: [{ name: "Full Name", value: "Jane Doe" }] },
});
```

> **Note:** The synchronous methods above have a 5-minute timeout and are best suited for onboarding and testing. For production workloads, use [polling helpers](#polling-helpers) or [webhooks](#webhook-verification) instead.

## Typed extraction with Zod

The SDK supports [Zod](https://zod.dev/) schemas for fully typed extraction -- define your schema once and get end-to-end type safety from request to response:

```typescript
import { ExtendClient, extendDate, extendCurrency } from "extend-ai";
import { z } from "zod";

const client = new ExtendClient({ token: "YOUR_API_KEY" });

const result = await client.extract({
  file: { url: "https://example.com/invoice.pdf" },
  config: {
    schema: z.object({
      invoice_number: z.string().nullable().describe("The invoice number"),
      invoice_date: extendDate().describe("The invoice date"),
      line_items: z.array(z.object({
        description: z.string().nullable(),
        amount: extendCurrency(),
      })).describe("Line items on the invoice"),
      total: extendCurrency().describe("Total amount due"),
    }),
  },
});

// output.value is fully typed based on your schema
console.log(result.output.value.invoice_number);           // string | null
console.log(result.output.value.invoice_date);             // string | null (ISO date)
console.log(result.output.value.total.amount);             // number | null
console.log(result.output.value.total.iso_4217_currency_code); // string | null
```

### Custom field types

The SDK provides helpers for Extend-specific field types that map to specialized extraction behavior:

| Helper | Output type | Description |
|---|---|---|
| `extendDate()` | `string \| null` | ISO date string (yyyy-mm-dd) |
| `extendCurrency()` | `{ amount: number \| null, iso_4217_currency_code: string \| null }` | Currency with amount and code |
| `extendSignature()` | `{ printed_name, signature_date, is_signed, title_or_role }` | Signature detection |

All helpers support `.describe()`, `.optional()`, and `.nullable()` chaining.

## Polling helpers

Every run resource exposes a `createAndPoll()` method that creates the run and automatically polls until it reaches a terminal state (`PROCESSED`, `FAILED`, or `CANCELLED`):

```typescript
import { ExtendClient } from "extend-ai";

const client = new ExtendClient({ token: "YOUR_API_KEY" });

const result = await client.extractRuns.createAndPoll({
  file: { url: "https://example.com/invoice.pdf" },
  extractor: { id: "ex_abc123" },
});

if (result.status === "PROCESSED") {
  console.log(result.output);
} else {
  console.log(`Failed: ${result.failureMessage}`);
}
```

This works across all run types:

```typescript
const parseRun    = await client.parseRuns.createAndPoll({ file: { url: "..." } });
const extractRun  = await client.extractRuns.createAndPoll({ file: { url: "..." }, extractor: { id: "..." } });
const classifyRun = await client.classifyRuns.createAndPoll({ file: { url: "..." }, classifier: { id: "..." } });
const splitRun    = await client.splitRuns.createAndPoll({ file: { url: "..." }, splitter: { id: "..." } });
const workflowRun = await client.workflowRuns.createAndPoll({ file: { url: "..." }, workflow: { id: "..." } });
const editRun     = await client.editRuns.createAndPoll({ file: { url: "..." } });
```

Typed Zod schemas work with `createAndPoll` too:

```typescript
const result = await client.extractRuns.createAndPoll({
  file: { url: "https://example.com/invoice.pdf" },
  config: {
    schema: z.object({
      invoice_number: z.string().nullable(),
      total: extendCurrency(),
    }),
  },
});

// result.output.value is fully typed
console.log(result.output.value.invoice_number); // string | null
```

### Custom polling options

```typescript
import { ExtendClient, type PollingOptions } from "extend-ai";

const result = await client.extractRuns.createAndPoll(
  {
    file: { url: "https://example.com/invoice.pdf" },
    extractor: { id: "ex_abc123" },
  },
  {
    polling: {
      maxWaitMs: 300_000,       // 5 minute timeout (default: no timeout)
      initialDelayMs: 1_000,    // start with 1s delay (default)
      maxDelayMs: 60_000,       // cap at 60s delay (default: 30s)
    },
  },
);
```

## Running workflows

Workflows chain multiple processing steps (extraction, classification, splitting, etc.) into a single pipeline. Run a workflow by passing a workflow ID and a file:

```typescript
const result = await client.workflowRuns.createAndPoll({
  file: { url: "https://example.com/invoice.pdf" },
  workflow: { id: "workflow_abc123" },
});

console.log(result.status); // "PROCESSED"

for (const stepRun of result.stepRuns ?? []) {
  console.log(stepRun.step.type);   // "EXTRACT", "CLASSIFY", etc.
  console.log(stepRun.result);
}
```

## Webhook verification

Verify and parse incoming webhook events using the built-in utilities:

```typescript
import { ExtendClient, type Extend } from "extend-ai";

const client = new ExtendClient({ token: "YOUR_API_KEY" });

function handleWebhook(req: Request) {
  const event = client.webhooks.verifyAndParse(
    await req.text(),
    Object.fromEntries(req.headers),
    "wss_your_signing_secret",
  );

  switch (event.eventType) {
    case "extract_run.processed":
      console.log(`Extraction complete: ${event.data.id}`);
      break;
    case "workflow_run.completed":
      console.log(`Workflow complete: ${event.data.id}`);
      break;
    default:
      console.log(`Received event: ${event.eventType}`);
  }
}
```

### Manual verification & parsing

```typescript
// Verify signature without parsing
const isValid = client.webhooks.verify(body, headers, signingSecret);

// Parse without verification (not recommended for production)
const event = client.webhooks.parse(body);
```

### Signed URL payloads

For large payloads, Extend may send a signed URL instead of the full payload. The SDK handles this transparently:

```typescript
const event = client.webhooks.verifyAndParse(body, headers, signingSecret, {
  allowSignedUrl: true,
});

if (client.webhooks.isSignedUrlEvent(event)) {
  const fullPayload = await client.webhooks.fetchSignedPayload(event);
}
```

## Request & response types

The SDK exports all request and response types under the `Extend` namespace:

```typescript
import { Extend } from "extend-ai";

const request: Extend.ExtractRunsCreateRequest = {
  file: { url: "https://example.com/invoice.pdf" },
  extractor: { id: "ex_abc123" },
};

function handleResult(run: Extend.ExtractRun) {
  if (run.status === "PROCESSED") {
    console.log(run.output);
  }
}
```

## Exception handling

The SDK raises typed exceptions for API errors:

```typescript
import { ExtendError } from "extend-ai";

try {
  await client.parse({ file: { url: "https://example.com/invoice.pdf" } });
} catch (err) {
  if (err instanceof ExtendError) {
    console.log(err.statusCode);  // 400, 401, 404, 429, etc.
    console.log(err.message);
    console.log(err.body);
    console.log(err.rawResponse);
  }
}
```

Specific error classes are available for fine-grained handling:

```typescript
import { Extend } from "extend-ai";

try {
  await client.extractRuns.create({ ... });
} catch (err) {
  if (err instanceof Extend.BadRequestError) { /* 400 */ }
  if (err instanceof Extend.UnauthorizedError) { /* 401 */ }
  if (err instanceof Extend.TooManyRequestsError) { /* 429 */ }
  if (err instanceof Extend.InternalServerError) { /* 500 */ }
}
```

### Polling timeout

When `createAndPoll()` exceeds its timeout, a `PollingTimeoutError` is raised:

```typescript
import { PollingTimeoutError } from "extend-ai";

try {
  await client.extractRuns.createAndPoll(
    { file: { url: "..." }, extractor: { id: "..." } },
    { polling: { maxWaitMs: 60_000 } },
  );
} catch (err) {
  if (err instanceof PollingTimeoutError) {
    console.log(`Timed out after ${err.elapsedMs}ms`);
  }
}
```

## Pagination

List endpoints return paginated results using `nextPageToken`:

```typescript
// First page
let response = await client.extractRuns.list({ maxPageSize: 10 });

for (const run of response.data) {
  console.log(`${run.id}: ${run.status}`);
}

// Next page
if (response.nextPageToken) {
  response = await client.extractRuns.list({
    maxPageSize: 10,
    nextPageToken: response.nextPageToken,
  });
}
```

## Environments

The SDK defaults to the US production environment. Other regions are available:

```typescript
import { ExtendClient, ExtendEnvironment } from "extend-ai";

// US (default)
const client = new ExtendClient({ token: "YOUR_API_KEY" });

// US2 (HIPAA)
const client = new ExtendClient({ token: "YOUR_API_KEY", environment: ExtendEnvironment.ProductionUs2 });

// EU
const client = new ExtendClient({ token: "YOUR_API_KEY", environment: ExtendEnvironment.ProductionEu1 });

// Custom base URL
const client = new ExtendClient({ token: "YOUR_API_KEY", baseUrl: "https://custom-api.example.com" });
```

## Advanced

### Retries

The SDK automatically retries failed requests with exponential backoff. Retries are triggered for:

- `408` Timeout
- `429` Too Many Requests
- `5xx` Server Errors

```typescript
// Override retries for a single request
await client.extractRuns.create({ ... }, { maxRetries: 0 });
```

### Timeouts

The default timeout is 300 seconds. Override globally or per-request:

```typescript
// Global timeout
const client = new ExtendClient({ token: "YOUR_API_KEY", timeoutInSeconds: 30 });

// Per-request timeout
await client.extractRuns.create({ ... }, { timeoutInSeconds: 60 });
```

### Aborting requests

Cancel any in-flight request using an `AbortController`:

```typescript
const controller = new AbortController();

const promise = client.parse(
  { file: { url: "https://example.com/large.pdf" } },
  { abortSignal: controller.signal },
);

controller.abort();
```

### Raw response data

Access underlying HTTP response data through `.withRawResponse()`:

```typescript
const { data, rawResponse } = await client
  .parse({ file: { url: "https://example.com/invoice.pdf" } })
  .withRawResponse();

console.log(rawResponse.status);    // 200
console.log(rawResponse.headers);   // Response headers
console.log(data);                  // ParseRun
```

### Custom headers

```typescript
const client = new ExtendClient({
  token: "YOUR_API_KEY",
  headers: { "X-Custom-Header": "value" },
});
```

### Custom fetch client

Override the underlying HTTP client for advanced use cases:

```typescript
import { ExtendClient } from "extend-ai";

const client = new ExtendClient({
  token: "YOUR_API_KEY",
  fetcher: myCustomFetchImplementation,
});
```

### API versioning

The SDK targets a specific API version by default. Override it if needed:

```typescript
const client = new ExtendClient({
  token: "YOUR_API_KEY",
  extendApiVersion: "2026-02-09",
});
```

### Runtime compatibility

The SDK defaults to `node-fetch` but will use the global `fetch` client if present. Supported runtimes:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

## Documentation

Full API reference documentation is available at [docs.extend.ai](https://docs.extend.ai/2026-02-09/developers).

A complete SDK reference is available in [reference.md](./reference.md).

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically. Additions made directly to this library would have to be moved over to our generation code, otherwise they would be overwritten upon the next generated release. Feel free to open a PR as a proof of concept, but know that we will not be able to merge it as-is. We suggest opening an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
