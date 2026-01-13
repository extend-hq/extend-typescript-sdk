# Polling with `createAndPoll` Methods

The Extend SDK provides convenient `createAndPoll` methods on run resources that combine creating a run and polling for completion in a single call. These methods use exponential backoff with proportional jitter to efficiently wait for runs to complete.

## Available Methods

- `client.extractRuns.createAndPoll()` - Create and poll an extract run
- `client.classifyRuns.createAndPoll()` - Create and poll a classify run
- `client.splitRuns.createAndPoll()` - Create and poll a split run
- `client.editRuns.createAndPoll()` - Create and poll an edit run
- `client.parseRuns.createAndPoll()` - Create and poll a parse run
- `client.workflowRuns.createAndPoll()` - Create and poll a workflow run

## Basic Usage

```typescript
import { ExtendClient } from "extend-ai";

const client = new ExtendClient({ token: "your-api-key" });

// Create an extract run and wait for completion
const result = await client.extractRuns.createAndPoll({
    file: { url: "https://example.com/document.pdf" },
    extractor: { id: "extractor_abc123" },
});

if (result.extractRun.status === "PROCESSED") {
    console.log("Output:", result.extractRun.output);
} else if (result.extractRun.status === "FAILED") {
    console.error("Failed:", result.extractRun.failureReason);
}
```

## Typed Responses with Zod Schemas

For extraction runs, you can define your schema using Zod and get fully typed responses:

```typescript
import { ExtendClient, extendSchema, extendDate, extendCurrency } from "extend-ai";
import { z } from "zod";

const client = new ExtendClient({ token: "your-api-key" });

// Define a typed schema
const InvoiceSchema = extendSchema({
    invoice_number: z.string().nullable().describe("The invoice number"),
    invoice_date: extendDate().describe("The invoice date (ISO format)"),
    total: extendCurrency().describe("Total invoice amount"),
    line_items: z
        .array(
            z.object({
                description: z.string().nullable(),
                quantity: z.number().nullable(),
                unit_price: z.number().nullable(),
            }),
        )
        .describe("Line items on the invoice"),
});

// Create and poll with typed response
const result = await client.extractRuns.createAndPoll({
    file: { url: "https://example.com/invoice.pdf" },
    config: {
        schema: InvoiceSchema,
        baseProcessor: "extraction_performance",
    },
});

// TypeScript knows the exact shape of output.value!
if (result.extractRun.status === "PROCESSED") {
    const output = result.extractRun.output.value;
    console.log(output.invoice_number); // string | null
    console.log(output.invoice_date); // string | null (ISO date)
    console.log(output.total.amount); // number | null
    console.log(output.total.iso_4217_currency_code); // string | null
    output.line_items.forEach((item) => {
        console.log(item.description, item.quantity, item.unit_price);
    });
}
```

### Using with Extractors (overrideConfig)

You can also use typed schemas when overriding an existing extractor's config:

```typescript
const result = await client.extractRuns.createAndPoll({
    file: { url: "https://example.com/invoice.pdf" },
    extractor: {
        id: "extractor_abc123",
        overrideConfig: {
            schema: InvoiceSchema,
            baseProcessor: "extraction_performance",
        },
    },
});

// Same typed output!
console.log(result.extractRun.output.value.invoice_number);
```

### Custom Field Types

The SDK provides special helpers for Extend's custom field types:

```typescript
import { extendSchema, extendDate, extendCurrency, extendSignature } from "extend-ai";
import { z } from "zod";

const DocumentSchema = extendSchema({
    // Date fields - output is always ISO format (yyyy-mm-dd)
    effective_date: extendDate().describe("Contract effective date"),

    // Currency fields - output has amount and currency code
    contract_value: extendCurrency().describe("Total contract value"),

    // Signature fields - detects signatures with enhanced processing
    customer_signature: extendSignature().describe("Customer signature block"),

    // Standard Zod types work too
    document_title: z.string().nullable().describe("Document title"),
    page_count: z.number().nullable().describe("Number of pages"),
    is_signed: z.boolean().nullable().describe("Whether document is signed"),
    status: z.enum(["draft", "final", "archived"]).describe("Document status"),
});
```

### Schema Requirements

When using `extendSchema`, your schema must follow these rules:

- All primitive fields should be nullable (use `.nullable()`)
- Maximum nesting level is 3
- Enums must be string-only
- Property keys can only contain letters, numbers, underscores, and hyphens
- Arrays can contain objects or primitive types

See the [JSON Schema documentation](https://docs.extend.ai/product/extraction/schema/json-schema) for full details.

## Polling Options

You can customize the polling behavior with the following options:

```typescript
const result = await client.extractRuns.createAndPoll(
    { file: { url: "..." } },
    {
        maxWaitMs: 600000, // Maximum wait time (default: 300000 = 5 min)
        initialDelayMs: 2000, // Initial delay between polls (default: 1000 = 1s)
        maxDelayMs: 60000, // Maximum delay between polls (default: 30000 = 30s)
        jitterFraction: 0.25, // Jitter randomization (default: 0.25 = ±25%)
    },
);
```

### Option Details

| Option           | Default        | Description                                                      |
| ---------------- | -------------- | ---------------------------------------------------------------- |
| `maxWaitMs`      | 300000 (5 min) | Maximum total time to wait before throwing `PollingTimeoutError` |
| `initialDelayMs` | 1000 (1s)      | Delay before the first poll after creation                       |
| `maxDelayMs`     | 30000 (30s)    | Maximum delay between polls (caps exponential growth)            |
| `jitterFraction` | 0.25           | Random variation applied to delays (±25% by default)             |

## Handling Timeouts

If a run doesn't complete within `maxWaitMs`, a `PollingTimeoutError` is thrown:

```typescript
import { ExtendClient, PollingTimeoutError } from "extend-ai";

try {
    const result = await client.extractRuns.createAndPoll(
        { file: { url: "..." } },
        { maxWaitMs: 60000 }, // 1 minute timeout
    );
} catch (error) {
    if (error instanceof PollingTimeoutError) {
        console.log(`Polling timed out after ${error.elapsedMs}ms`);
        // The run is still processing - you can poll manually or use webhooks
    }
}
```

## Recommended Timeouts by Run Type

Based on production data analysis (January 2026), here are the observed processing times:

| Run Type     | p50   | p95     | p99           | Recommended `maxWaitMs` |
| ------------ | ----- | ------- | ------------- | ----------------------- |
| **Parse**    | 4.6s  | 14s     | 32s           | 60,000 (1 min)          |
| **Edit**     | 3.6s  | 85s     | 2.5 min       | 300,000 (5 min)         |
| **Classify** | 6.5s  | 17s     | 1.4 min       | 180,000 (3 min)         |
| **Extract**  | 10s   | 48s     | 2.3 min       | 300,000 (5 min)         |
| **Split**    | 8.8s  | 65s     | 4 min         | 300,000 (5 min)         |
| **Workflow** | 21.5s | 4.5 min | **2.5 hours** | 900,000+ (15+ min)      |

> **Important**: Workflow runs have a very long tail - the p99 is ~2.5 hours. For workflow runs, consider using webhooks instead of polling, or set a much longer `maxWaitMs`.

## Exponential Backoff Algorithm

The polling uses exponential backoff with proportional jitter:

```
delay = min(initialDelay × 2^attempt, maxDelay) × (1 + jitter)
```

Where `jitter` is uniformly distributed in `[-jitterFraction, +jitterFraction]`.

**Example progression** (with defaults, no jitter for clarity):

- Poll 1: immediate (after create)
- Poll 2: 1s delay
- Poll 3: 2s delay
- Poll 4: 4s delay
- Poll 5: 8s delay
- Poll 6: 16s delay
- Poll 7+: 30s delay (capped)

The jitter prevents thundering herd problems when many clients poll simultaneously.

## When to Use Polling vs Webhooks

| Use Case                           | Recommendation                                     |
| ---------------------------------- | -------------------------------------------------- |
| Quick operations (parse, classify) | `createAndPoll` works well                         |
| Extract/split runs                 | `createAndPoll` with default timeout               |
| Workflow runs                      | **Prefer webhooks** for reliability                |
| Batch processing                   | **Use webhooks** - polling doesn't scale           |
| User-facing UI                     | `createAndPoll` with reasonable timeout + fallback |

## Alternative: Manual Polling

If you need more control, you can poll manually:

```typescript
const created = await client.extractRuns.create({
    file: { url: "..." },
});

let result = await client.extractRuns.retrieve(created.extractRun.id);

while (result.extractRun.status === "PROCESSING") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    result = await client.extractRuns.retrieve(created.extractRun.id);
}
```

## See Also

- [Webhooks Documentation](https://docs.extend.ai/webhooks) - For event-driven processing
- [API Reference](https://docs.extend.ai/api-reference) - Full API documentation
