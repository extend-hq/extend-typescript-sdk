/**
 * Webhook utilities for signature verification and event parsing.
 *
 * @example
 * ```typescript
 * import { ExtendClient } from "extend-ai";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * app.post("/webhook", (req, res) => {
 *   try {
 *     const event = client.webhooks.verifyAndParse(
 *       req.body.toString(),
 *       req.headers,
 *       "wss_your_signing_secret"
 *     );
 *
 *     switch (event.eventType) {
 *       case "workflow_run.completed":
 *         console.log("Workflow completed:", event.payload);
 *         break;
 *     }
 *
 *     res.status(200).send("OK");
 *   } catch (err) {
 *     res.status(401).send("Invalid signature");
 *   }
 * });
 * ```
 */

import * as crypto from "crypto";
import * as Extend from "../../api";

// ============================================================================
// Types
// ============================================================================

/**
 * Extract the eventType union from the WebhookEvent discriminated union.
 */
export type WebhookEventType = Extend.WebhookEvent["eventType"];

export interface WebhookHeaders {
    "x-extend-request-timestamp"?: string;
    "x-extend-request-signature"?: string;
    [key: string]: string | string[] | undefined;
}

export interface VerifyOptions {
    /**
     * Maximum age of the request in seconds (default: 300 = 5 minutes).
     * Set to 0 to disable timestamp validation.
     */
    maxAgeSeconds?: number;
}

export interface VerifyAndParseOptions extends VerifyOptions {
    /**
     * Whether to allow signed URL payloads.
     * Default: false
     *
     * When false (default): Returns `WebhookEvent`. Throws `SignedUrlNotAllowedError` if
     *                       a signed URL payload is received.
     * When true: Returns `RawWebhookEvent` (union of `WebhookEvent | WebhookEventWithSignedUrl`).
     *            Use `isSignedUrlEvent()` to check and `fetchSignedPayload()` to get the full data.
     */
    allowSignedUrl?: boolean;
}

/**
 * Payload structure when webhook is delivered via signed URL (for large payloads).
 */
export interface SignedDataUrlPayload {
    /** The signed URL to fetch the full payload (expires in 1 hour) */
    data: string;
    /** The ID of the run/resource */
    id: string;
    /** Discriminator indicating this is a signed URL payload */
    object: "signed_data_url";
    /** Optional metadata passed when the run was created */
    metadata?: Record<string, unknown>;
}

/**
 * Webhook event when payload is delivered via signed URL (before fetching).
 */
export interface WebhookEventWithSignedUrl {
    /** Unique identifier for this webhook event */
    eventId: string;
    /** The type of event (e.g., "workflow_run.completed") */
    eventType: WebhookEventType;
    /** The signed URL payload - use fetchSignedPayload() to get the full data */
    payload: SignedDataUrlPayload;
}

/**
 * Union type representing either a normal webhook event or one with a signed URL payload.
 * Use isSignedUrlEvent() to narrow the type.
 */
export type RawWebhookEvent = Extend.WebhookEvent | WebhookEventWithSignedUrl;

// ============================================================================
// Errors
// ============================================================================

export class WebhookSignatureVerificationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WebhookSignatureVerificationError";
    }
}

export class WebhookPayloadFetchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WebhookPayloadFetchError";
    }
}

export class SignedUrlNotAllowedError extends Error {
    constructor() {
        super(
            "Received signed URL payload but allowSignedUrl option is not enabled. " +
                "Either pass { allowSignedUrl: true } to verifyAndParse() to handle signed URL payloads, " +
                "or configure your webhook endpoint in the Extend dashboard to not use signed URLs.",
        );
        this.name = "SignedUrlNotAllowedError";
    }
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a payload is a signed URL payload.
 */
function isSignedDataUrlPayload(payload: unknown): payload is SignedDataUrlPayload {
    return (
        typeof payload === "object" &&
        payload !== null &&
        "object" in payload &&
        (payload as SignedDataUrlPayload).object === "signed_data_url" &&
        "data" in payload &&
        typeof (payload as SignedDataUrlPayload).data === "string"
    );
}

// ============================================================================
// Webhooks Class
// ============================================================================

export class Webhooks {
    /**
     * Verifies the webhook signature and parses the event.
     *
     * By default, this method returns a `WebhookEvent`. If the webhook contains a
     * signed URL payload (used for large payloads), it throws a `SignedUrlNotAllowedError`.
     *
     * To handle signed URL payloads, pass `{ allowSignedUrl: true }`. This changes the
     * return type to `RawWebhookEvent`. Use `isSignedUrlEvent()` to check if you received
     * a signed URL, then call `fetchSignedPayload()` to get the full payload.
     *
     * @param body - The raw request body as a string
     * @param headers - The request headers (must include x-extend-request-timestamp and x-extend-request-signature)
     * @param signingSecret - Your webhook signing secret (starts with wss_)
     * @param options - Optional configuration
     * @returns The verified and typed webhook event
     * @throws {WebhookSignatureVerificationError} If signature verification fails
     * @throws {SignedUrlNotAllowedError} If a signed URL payload is received without allowSignedUrl: true
     *
     * @example
     * ```typescript
     * // Simple usage (most users) - throws if signed URL received
     * const event = client.webhooks.verifyAndParse(body, headers, secret);
     * // event is WebhookEvent
     *
     * // Handle signed URL payloads
     * const event = client.webhooks.verifyAndParse(body, headers, secret, { allowSignedUrl: true });
     * if (client.webhooks.isSignedUrlEvent(event)) {
     *   // Check metadata before fetching (e.g., environment check)
     *   if (event.payload.metadata?.env === "production") {
     *     const fullEvent = await client.webhooks.fetchSignedPayload(event);
     *     // handle fullEvent
     *   }
     * } else {
     *   // Normal inline payload
     *   // handle event
     * }
     * ```
     */
    public verifyAndParse(
        body: string,
        headers: WebhookHeaders,
        signingSecret: string,
        options?: VerifyAndParseOptions & { allowSignedUrl?: false },
    ): Extend.WebhookEvent;
    public verifyAndParse(
        body: string,
        headers: WebhookHeaders,
        signingSecret: string,
        options: VerifyAndParseOptions & { allowSignedUrl: true },
    ): RawWebhookEvent;
    public verifyAndParse(
        body: string,
        headers: WebhookHeaders,
        signingSecret: string,
        options: VerifyAndParseOptions = {},
    ): Extend.WebhookEvent | RawWebhookEvent {
        const { allowSignedUrl = false, ...verifyOptions } = options;

        // Verify the signature
        this.verifySignature(body, headers, signingSecret, verifyOptions);

        // Parse the event
        let event: RawWebhookEvent;
        try {
            event = JSON.parse(body) as RawWebhookEvent;
        } catch {
            throw new WebhookSignatureVerificationError("Failed to parse webhook body as JSON");
        }

        // Check if it's a signed URL payload
        if (isSignedDataUrlPayload(event.payload)) {
            if (!allowSignedUrl) {
                throw new SignedUrlNotAllowedError();
            }
            // Return as RawWebhookEvent (user opted in)
            return event;
        }

        // Normal event
        return event as Extend.WebhookEvent;
    }

    /**
     * Verifies a webhook signature without parsing the body.
     *
     * @param body - The raw request body as a string
     * @param headers - The request headers
     * @param signingSecret - Your webhook signing secret
     * @param options - Optional configuration
     * @returns true if the signature is valid
     *
     * @example
     * ```typescript
     * const isValid = client.webhooks.verify(body, headers, secret);
     * if (isValid) {
     *   const event = client.webhooks.parse(body);
     *   // handle event
     * }
     * ```
     */
    public verify(body: string, headers: WebhookHeaders, signingSecret: string, options: VerifyOptions = {}): boolean {
        try {
            this.verifySignature(body, headers, signingSecret, options);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Parses a webhook event from a raw body without verification.
     * Use this only if you've already verified the signature using verify().
     *
     * @param body - The raw request body as a string
     * @returns The parsed webhook event (may be a signed URL event)
     *
     * @example
     * ```typescript
     * if (client.webhooks.verify(body, headers, secret)) {
     *   const event = client.webhooks.parse(body);
     *   if (client.webhooks.isSignedUrlEvent(event)) {
     *     const fullEvent = await client.webhooks.fetchSignedPayload(event);
     *   }
     * }
     * ```
     */
    public parse(body: string): RawWebhookEvent {
        return JSON.parse(body) as RawWebhookEvent;
    }

    /**
     * Fetches the full payload from a signed URL webhook event.
     *
     * Use this when you've received a `WebhookEventWithSignedUrl` (from `verifyAndParse`
     * with `allowSignedUrl: true`) and want to retrieve the full payload.
     *
     * @param event - The webhook event with a signed URL payload
     * @returns The full webhook event with the resolved payload
     * @throws {WebhookPayloadFetchError} If fetching the signed URL fails
     *
     * @example
     * ```typescript
     * const event = client.webhooks.verifyAndParse(body, headers, secret, { allowSignedUrl: true });
     * if (client.webhooks.isSignedUrlEvent(event)) {
     *   // Check metadata before fetching (e.g., environment check)
     *   if (event.payload.metadata?.env === "production") {
     *     const fullEvent = await client.webhooks.fetchSignedPayload(event);
     *     // fullEvent.payload is now the full WorkflowRun, ExtractRun, etc.
     *   }
     * }
     * ```
     */
    public async fetchSignedPayload(event: WebhookEventWithSignedUrl): Promise<Extend.WebhookEvent> {
        const url = event.payload.data;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new WebhookPayloadFetchError(
                    `Failed to fetch signed payload: ${response.status} ${response.statusText}`,
                );
            }

            const fullPayload = await response.json();

            return {
                eventId: event.eventId,
                eventType: event.eventType,
                payload: fullPayload,
            } as Extend.WebhookEvent;
        } catch (error) {
            if (error instanceof WebhookPayloadFetchError) {
                throw error;
            }
            throw new WebhookPayloadFetchError(
                `Failed to fetch signed payload: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    /**
     * Type guard to check if a webhook event has a signed URL payload.
     *
     * Use this to narrow the type of a `RawWebhookEvent` to determine if you need
     * to call `fetchSignedPayload()` to get the full payload.
     *
     * @param event - The webhook event to check
     * @returns true if the event has a signed URL payload
     *
     * @example
     * ```typescript
     * const event = client.webhooks.verifyAndParse(body, headers, secret, { allowSignedUrl: true });
     * if (client.webhooks.isSignedUrlEvent(event)) {
     *   // event is WebhookEventWithSignedUrl
     *   console.log("Signed URL:", event.payload.data);
     *   console.log("Metadata:", event.payload.metadata);
     * } else {
     *   // event is WebhookEvent
     *   console.log("Full payload:", event.payload);
     * }
     * ```
     */
    public isSignedUrlEvent(event: RawWebhookEvent): event is WebhookEventWithSignedUrl {
        return isSignedDataUrlPayload(event.payload);
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    /**
     * Verifies the webhook signature. Throws on failure.
     */
    private verifySignature(
        body: string,
        headers: WebhookHeaders,
        signingSecret: string,
        options: VerifyOptions = {},
    ): void {
        const { maxAgeSeconds = 300 } = options;

        // Extract headers (handle case-insensitive lookup)
        const timestamp = this.getHeader(headers, "x-extend-request-timestamp");
        const signature = this.getHeader(headers, "x-extend-request-signature");

        if (!timestamp) {
            throw new WebhookSignatureVerificationError("Missing x-extend-request-timestamp header");
        }

        if (!signature) {
            throw new WebhookSignatureVerificationError("Missing x-extend-request-signature header");
        }

        if (!signingSecret) {
            throw new WebhookSignatureVerificationError("Missing signing secret");
        }

        // Validate timestamp to prevent replay attacks
        if (maxAgeSeconds > 0) {
            const currentTime = Math.floor(Date.now() / 1000);
            const requestTime = parseInt(timestamp, 10);

            if (isNaN(requestTime)) {
                throw new WebhookSignatureVerificationError("Invalid timestamp format");
            }

            const age = currentTime - requestTime;
            if (age > maxAgeSeconds) {
                throw new WebhookSignatureVerificationError(`Request timestamp too old (${age}s > ${maxAgeSeconds}s)`);
            }

            if (age < -60) {
                // Allow 1 minute clock skew
                throw new WebhookSignatureVerificationError("Request timestamp in the future");
            }
        }

        // Compute expected signature
        const message = `v0:${timestamp}:${body}`;
        const expectedSignature = crypto.createHmac("sha256", signingSecret).update(message).digest("hex");

        // Use timing-safe comparison to prevent timing attacks
        const signatureBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (signatureBuffer.length !== expectedBuffer.length) {
            throw new WebhookSignatureVerificationError("Invalid signature");
        }

        const isValid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

        if (!isValid) {
            throw new WebhookSignatureVerificationError("Invalid signature");
        }
    }

    private getHeader(headers: WebhookHeaders, name: string): string | undefined {
        // Try exact match first
        const value = headers[name] ?? headers[name.toLowerCase()];
        if (Array.isArray(value)) {
            return value[0];
        }
        return value;
    }
}
