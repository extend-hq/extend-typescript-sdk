# Webhook Helpers

The Extend SDK provides built-in webhook utilities for verifying signatures and parsing events securely.

## Basic Usage

```typescript
import { ExtendClient, WebhookSignatureVerificationError } from "extend-ai";

const client = new ExtendClient({ token: "your-api-key" });

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
    try {
        const event = client.webhooks.verifyAndParse(
            req.body.toString(),
            req.headers,
            process.env.EXTEND_WEBHOOK_SECRET!,
        );

        switch (event.eventType) {
            case "workflow_run.completed":
                console.log("Workflow completed:", event.payload.id);
                break;
            case "extract_run.processed":
                console.log("Extraction done:", event.payload.output);
                break;
            case "workflow_run.failed":
                console.error("Workflow failed:", event.payload.failureReason);
                break;
        }

        res.status(200).send("OK");
    } catch (err) {
        if (err instanceof WebhookSignatureVerificationError) {
            res.status(401).send("Invalid signature");
        } else {
            res.status(500).send("Internal error");
        }
    }
});
```

## Available Methods

| Method               | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `verifyAndParse()`   | Verify signature and parse event in one call             |
| `verify()`           | Verify signature only (returns boolean)                  |
| `parse()`            | Parse event without verification                         |
| `isSignedUrlEvent()` | Type guard to check for signed URL payloads              |
| `fetchSignedPayload()` | Fetch full payload from a signed URL event             |

## Handling Signed URL Payloads

For large payloads (e.g., workflow runs with many documents), Extend may deliver webhooks with a signed URL instead of the full payload. This keeps webhook delivery fast and reliable.

By default, `verifyAndParse()` throws a `SignedUrlNotAllowedError` if a signed URL payload is received. To handle these payloads, opt-in with `{ allowSignedUrl: true }`:

```typescript
import {
    ExtendClient,
    SignedUrlNotAllowedError,
    WebhookPayloadFetchError,
} from "extend-ai";

const client = new ExtendClient({ token: "your-api-key" });

app.post("/webhook", async (req, res) => {
    try {
        // Opt-in to handle signed URL payloads
        const event = client.webhooks.verifyAndParse(req.body.toString(), req.headers, secret, {
            allowSignedUrl: true,
        });

        // Check if this is a signed URL event
        if (client.webhooks.isSignedUrlEvent(event)) {
            // You can access metadata before fetching
            console.log("Resource ID:", event.payload.id);
            console.log("Metadata:", event.payload.metadata);

            // Fetch the full payload when ready
            const fullEvent = await client.webhooks.fetchSignedPayload(event);
            console.log("Full payload:", fullEvent.payload);
        } else {
            // Normal inline payload
            console.log("Payload:", event.payload);
        }

        res.status(200).send("OK");
    } catch (err) {
        if (err instanceof WebhookPayloadFetchError) {
            // Signed URL expired or network error
            res.status(500).send("Failed to fetch payload");
        }
        // ...
    }
});
```

### Signed URL Payload Structure

When you receive a signed URL event, the payload has this structure:

```typescript
interface SignedDataUrlPayload {
    object: "signed_data_url"; // Discriminator
    data: string; // Signed URL to fetch (expires in 1 hour)
    id: string; // Resource ID (workflow_run, extract_run, etc.)
    metadata?: Record<string, unknown>; // Your custom metadata
}
```

## Verifying Without Parsing

If you need to verify the signature separately from parsing:

```typescript
// Returns boolean - never throws
const isValid = client.webhooks.verify(body, headers, secret);

if (isValid) {
    // Parse manually (can be a signed URL event)
    const event = client.webhooks.parse(body);

    if (client.webhooks.isSignedUrlEvent(event)) {
        // Handle signed URL
    } else {
        // Handle normal event
    }
}
```

## Options

### VerifyAndParseOptions

```typescript
interface VerifyAndParseOptions {
    /**
     * Maximum age of the request in seconds (default: 300 = 5 minutes).
     * Set to 0 to disable timestamp validation.
     */
    maxAgeSeconds?: number;

    /**
     * Whether to allow signed URL payloads.
     * Default: false
     *
     * When false: Returns WebhookEvent. Throws SignedUrlNotAllowedError if signed URL received.
     * When true: Returns RawWebhookEvent union type.
     */
    allowSignedUrl?: boolean;
}
```

### Customizing Timestamp Tolerance

By default, webhooks are rejected if they're older than 5 minutes. Adjust this with `maxAgeSeconds`:

```typescript
// Accept webhooks up to 10 minutes old
const event = client.webhooks.verifyAndParse(body, headers, secret, {
    maxAgeSeconds: 600,
});

// Disable timestamp validation (not recommended for production)
const event = client.webhooks.verifyAndParse(body, headers, secret, {
    maxAgeSeconds: 0,
});
```

## Error Types

| Error                              | When Thrown                                    |
| ---------------------------------- | ---------------------------------------------- |
| `WebhookSignatureVerificationError` | Invalid signature, missing headers, expired timestamp |
| `SignedUrlNotAllowedError`         | Signed URL received without `allowSignedUrl: true`    |
| `WebhookPayloadFetchError`         | Failed to fetch from signed URL                       |

```typescript
import {
    WebhookSignatureVerificationError,
    SignedUrlNotAllowedError,
    WebhookPayloadFetchError,
} from "extend-ai";

try {
    const event = client.webhooks.verifyAndParse(body, headers, secret);
} catch (err) {
    if (err instanceof SignedUrlNotAllowedError) {
        // Large payload - need to opt-in to signed URLs
        console.log("Received signed URL payload");
    } else if (err instanceof WebhookSignatureVerificationError) {
        console.error("Invalid webhook:", err.message);
    }
}
```

## Event Types

The `eventType` field is a discriminated union. Use it in a switch statement for type-safe payload access:

```typescript
switch (event.eventType) {
    // Workflow events
    case "workflow_run.completed":
    case "workflow_run.failed":
    case "workflow_run.needs_review":
    case "workflow_run.rejected":
    case "workflow_run.cancelled":
        // event.payload is WorkflowRun
        break;

    // Extract events
    case "extract_run.processed":
    case "extract_run.failed":
        // event.payload is ExtractRun
        break;

    // Classify events
    case "classify_run.processed":
    case "classify_run.failed":
        // event.payload is ClassifyRun
        break;

    // Split events
    case "split_run.processed":
    case "split_run.failed":
        // event.payload is SplitRun
        break;

    // Parse events
    case "parse_run.processed":
    case "parse_run.failed":
        // event.payload is ParseRun
        break;

    // Edit events
    case "edit_run.processed":
    case "edit_run.failed":
        // event.payload is EditRun
        break;

    // Resource lifecycle events
    case "workflow.created":
    case "workflow.deployed":
    case "workflow.deleted":
    case "extractor.created":
    case "extractor.updated":
    case "extractor.deleted":
    // ... and more
}
```

## Framework Examples

### Express.js

```typescript
import express from "express";
import { ExtendClient, WebhookSignatureVerificationError } from "extend-ai";

const app = express();
const client = new ExtendClient({ token: process.env.EXTEND_API_KEY! });

// Important: Use raw body for signature verification
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
    try {
        const event = client.webhooks.verifyAndParse(
            req.body.toString(),
            req.headers,
            process.env.EXTEND_WEBHOOK_SECRET!,
        );
        // Handle event...
        res.status(200).send("OK");
    } catch (err) {
        res.status(401).send("Invalid signature");
    }
});
```

### Next.js (App Router)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { ExtendClient } from "extend-ai";

const client = new ExtendClient({ token: process.env.EXTEND_API_KEY! });

export async function POST(request: NextRequest) {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers);

    try {
        const event = client.webhooks.verifyAndParse(body, headers, process.env.EXTEND_WEBHOOK_SECRET!);
        // Handle event...
        return NextResponse.json({ received: true });
    } catch (err) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
}
```

### Fastify

```typescript
import Fastify from "fastify";
import { ExtendClient } from "extend-ai";

const fastify = Fastify();
const client = new ExtendClient({ token: process.env.EXTEND_API_KEY! });

// Get raw body
fastify.addContentTypeParser("application/json", { parseAs: "string" }, (req, body, done) => {
    done(null, body);
});

fastify.post("/webhook", async (request, reply) => {
    try {
        const event = client.webhooks.verifyAndParse(
            request.body as string,
            request.headers,
            process.env.EXTEND_WEBHOOK_SECRET!,
        );
        // Handle event...
        return { received: true };
    } catch (err) {
        reply.status(401);
        return { error: "Invalid signature" };
    }
});
```

## Security Best Practices

1. **Always verify signatures** - Never skip verification in production
2. **Use environment variables** - Store your webhook secret securely
3. **Use raw body** - Parse the body as a string before verification
4. **Handle timeouts** - Signed URLs expire after 1 hour
5. **Idempotency** - Handle duplicate webhooks gracefully (use `eventId`)
6. **Respond quickly** - Return 200 before doing heavy processing

```typescript
app.post("/webhook", async (req, res) => {
    const event = client.webhooks.verifyAndParse(body, headers, secret);

    // Acknowledge quickly
    res.status(200).send("OK");

    // Process asynchronously
    processWebhookAsync(event).catch(console.error);
});
```

## See Also

- [Polling Documentation](./polling.md) - For synchronous create-and-wait patterns
- [API Reference](https://docs.extend.ai/api-reference) - Full API documentation
- [Webhook Events Reference](https://docs.extend.ai/webhooks) - All event types
