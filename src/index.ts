export * as Extend from "./api";
export { ExtendError, ExtendTimeoutError } from "./errors";
export { ExtendEnvironment } from "./environments";

// Export the extended client (with webhooks, polling, typed schemas) instead of the generated client
export { ExtendClient } from "./wrapper/ExtendClient";

// Webhook utilities
export { Webhooks, WebhookSignatureVerificationError } from "./wrapper";
export type { WebhookHeaders, UnwrapOptions } from "./wrapper";

// Polling utilities
export { PollingTimeoutError } from "./wrapper";
export type { PollingOptions, CreateAndPollOptions } from "./wrapper";

// Schema utilities for typed extraction
export { extendSchema, extendDate, extendCurrency, extendSignature, SchemaConversionError } from "./wrapper";
export type { ExtendSchemaWrapper, InferExtendSchema } from "./wrapper";
