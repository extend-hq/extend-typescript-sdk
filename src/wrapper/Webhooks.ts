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
 *     const event = client.webhooks.unwrap(
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
import * as Extend from "../api";

export interface WebhookHeaders {
    "x-extend-request-timestamp"?: string;
    "x-extend-request-signature"?: string;
    [key: string]: string | string[] | undefined;
}

export interface UnwrapOptions {
    /**
     * Maximum age of the request in seconds (default: 300 = 5 minutes).
     * Set to 0 to disable timestamp validation.
     */
    maxAgeSeconds?: number;
}

export class WebhookSignatureVerificationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WebhookSignatureVerificationError";
    }
}

export class Webhooks {
    /**
     * Unwraps and verifies a webhook request, returning the typed event payload.
     *
     * @param body - The raw request body as a string
     * @param headers - The request headers (must include x-extend-request-timestamp and x-extend-request-signature)
     * @param signingSecret - Your webhook signing secret (starts with wss_)
     * @param options - Optional configuration
     * @returns The verified and typed webhook event
     * @throws {WebhookSignatureVerificationError} If signature verification fails
     *
     * @example
     * ```typescript
     * // Express.js example
     * app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
     *   const event = client.webhooks.unwrap(
     *     req.body.toString(),
     *     req.headers,
     *     process.env.EXTEND_WEBHOOK_SECRET
     *   );
     *   // event is typed as Extend.WebhookEvent
     * });
     * ```
     */
    public unwrap(
        body: string,
        headers: WebhookHeaders,
        signingSecret: string,
        options: UnwrapOptions = {},
    ): Extend.WebhookEvent {
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

        // Parse and return the event
        try {
            return JSON.parse(body) as Extend.WebhookEvent;
        } catch {
            throw new WebhookSignatureVerificationError("Failed to parse webhook body as JSON");
        }
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
     * const isValid = client.webhooks.verify(
     *   req.body.toString(),
     *   req.headers,
     *   process.env.EXTEND_WEBHOOK_SECRET
     * );
     * ```
     */
    public verify(body: string, headers: WebhookHeaders, signingSecret: string, options: UnwrapOptions = {}): boolean {
        try {
            this.unwrap(body, headers, signingSecret, options);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Constructs a webhook event from a raw body without verification.
     * Use this only if you've already verified the signature separately.
     *
     * @param body - The raw request body as a string
     * @returns The parsed webhook event
     */
    public constructEvent(body: string): Extend.WebhookEvent {
        return JSON.parse(body) as Extend.WebhookEvent;
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
