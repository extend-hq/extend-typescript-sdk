export { ExtendClient } from "./ExtendClient";
export type {
  TypedExtractRequest,
  TypedExtractRequestWithConfig,
  TypedExtractRequestWithExtractor,
} from "./ExtendClient";

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
export {
  pollUntilDone,
  calculateBackoffDelay,
  PollingTimeoutError,
} from "./utilities/polling";
export type { PollingOptions } from "./utilities/polling";

// Run wrappers with createAndPoll methods
export { ExtractRunsWrapper } from "./resources/extractRuns";
export type {
  CreateAndPollOptions,
  TypedExtractorReference,
  TypedExtractRunsCreateRequest,
  TypedExtractRunsCreateRequestWithConfig,
  TypedExtractRunsCreateRequestWithExtractor,
  TypedExtractOutput,
  TypedExtractRun,
} from "./resources/extractRuns";

export { ExtractorsWrapper } from "./resources/extractors";
export type {
  TypedExtractorsCreateRequest,
  TypedExtractorsUpdateRequest,
} from "./resources/extractors";

export { ExtractorVersionsWrapper } from "./resources/extractorVersions";
export type { TypedExtractorVersionsCreateRequest } from "./resources/extractorVersions";

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

// Custom type helpers for zod schemas
export {
  extendDate,
  extendCurrency,
  extendSignature,
  SchemaConversionError,
} from "./schema";
export type {
  CurrencyValue,
  SignatureValue,
  TypedExtractConfig,
} from "./schema";
