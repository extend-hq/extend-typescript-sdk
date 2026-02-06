export * as Extend from "./api";
export { ExtendError, ExtendTimeoutError } from "./errors";
export { ExtendEnvironment } from "./environments";

// Export the extended client (with webhooks, polling) instead of the generated client
export { ExtendClient } from "./wrapper/ExtendClient";

// Webhook utilities
export {
    Webhooks,
    WebhookSignatureVerificationError,
    WebhookPayloadFetchError,
    SignedUrlNotAllowedError,
} from "./wrapper";
export type {
    WebhookHeaders,
    VerifyOptions,
    VerifyAndParseOptions,
    SignedDataUrlPayload,
    WebhookEventWithSignedUrl,
    WebhookEventType,
    RawWebhookEvent,
} from "./wrapper";

// Polling utilities
export { PollingTimeoutError } from "./wrapper";
export type { PollingOptions, CreateAndPollOptions } from "./wrapper";

// Custom type helpers for typed extraction with zod schemas
export { extendDate, extendCurrency, extendSignature, SchemaConversionError } from "./wrapper";
export type { CurrencyValue, SignatureValue } from "./wrapper";
