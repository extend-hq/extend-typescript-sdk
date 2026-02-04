export { ExtendClient } from "./ExtendClient";

// Webhooks
export {
    Webhooks,
    WebhookSignatureVerificationError,
    WebhookPayloadFetchError,
    SignedUrlNotAllowedError,
} from "./webhooks";
export type {
    WebhookHeaders,
    VerifyOptions,
    VerifyAndParseOptions,
    SignedDataUrlPayload,
    WebhookEventWithSignedUrl,
    WebhookEventType,
    RawWebhookEvent,
} from "./webhooks";

// Polling utilities
export { pollUntilDone, calculateBackoffDelay, PollingTimeoutError } from "./utilities/polling";
export type { PollingOptions } from "./utilities/polling";

// Run failure errors
export {
    RunFailedError,
    ParseRunFailedError,
    ExtractRunFailedError,
    ClassifyRunFailedError,
    SplitRunFailedError,
    EditRunFailedError,
    WorkflowRunFailedError,
} from "./errors";

// Run wrappers with createAndPoll methods
export { ExtractRunsWrapper } from "./resources/extractRuns";
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
} from "./resources/extractRuns";

export { ClassifyRunsWrapper } from "./resources/classifyRuns";
export type { CreateAndPollOptions as ClassifyRunsCreateAndPollOptions } from "./resources/classifyRuns";

export { SplitRunsWrapper } from "./resources/splitRuns";
export type { CreateAndPollOptions as SplitRunsCreateAndPollOptions } from "./resources/splitRuns";

export { WorkflowRunsWrapper } from "./resources/workflowRuns";
export type { CreateAndPollOptions as WorkflowRunsCreateAndPollOptions } from "./resources/workflowRuns";

export { EditRunsWrapper } from "./resources/editRuns";
export type { CreateAndPollOptions as EditRunsCreateAndPollOptions } from "./resources/editRuns";

export { ParseRunsWrapper } from "./resources/parseRuns";
export type { CreateAndPollOptions as ParseRunsCreateAndPollOptions } from "./resources/parseRuns";

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
