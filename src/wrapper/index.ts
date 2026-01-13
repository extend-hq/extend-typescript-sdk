export { ExtendClient } from "./ExtendClient";

export { Webhooks, WebhookSignatureVerificationError } from "./Webhooks";
export type { WebhookHeaders, UnwrapOptions } from "./Webhooks";

export { pollUntilDone, calculateBackoffDelay, PollingTimeoutError } from "./Polling";
export type { PollingOptions } from "./Polling";

export { ExtractRunsWrapper } from "./ExtractRunsWrapper";
export type {
    CreateAndPollOptions,
    TypedExtractConfig,
    TypedExtractorReference,
    TypedExtractRunsCreateRequest,
    TypedExtractRunsCreateRequestWithConfig,
    TypedExtractRunsCreateRequestWithExtractor,
    TypedExtractOutput,
    TypedExtractRun,
    TypedExtractRunsRetrieveResponse,
} from "./ExtractRunsWrapper";

// Schema utilities for typed extraction
export {
    extendSchema,
    extendDate,
    extendCurrency,
    extendSignature,
    isExtendSchema,
    getJsonSchema,
    SchemaConversionError,
} from "./schema";
export type { ExtendSchemaWrapper, ExtendRootJSONSchema, InferExtendSchema } from "./schema";
