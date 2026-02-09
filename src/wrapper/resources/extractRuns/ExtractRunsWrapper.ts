/**
 * Extended ExtractRuns client with polling utilities and typed responses.
 *
 * For typed schema support, use:
 * - `client.extract()` for synchronous extraction (waits for completion)
 * - `client.extractRuns.createAndPoll()` for async extraction with polling
 *
 * @example
 * ```typescript
 * import { ExtendClient, extendDate, extendCurrency } from "extend-ai";
 * import { z } from "zod";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * // Option 1: Use extract() for sync processing (waits for completion)
 * const result = await client.extract({
 *   file: { url: "https://example.com/invoice.pdf" },
 *   config: {
 *     schema: z.object({
 *       invoice_number: z.string().nullable().describe("The invoice number"),
 *       invoice_date: extendDate().describe("The invoice date"),
 *       total: extendCurrency().describe("Total amount"),
 *     }),
 *     baseProcessor: "extraction_performance",
 *   },
 * });
 *
 * // Option 2: Use createAndPoll() for async with polling
 * const result = await client.extractRuns.createAndPoll({
 *   file: { url: "https://example.com/invoice.pdf" },
 *   config: {
 *     schema: z.object({
 *       invoice_number: z.string().nullable(),
 *       total: extendCurrency(),
 *     }),
 *     baseProcessor: "extraction_performance",
 *   },
 * });
 *
 * // output.value is fully typed!
 * console.log(result.output.value.invoice_number); // string | null
 * console.log(result.output.value.total.amount); // number | null
 * ```
 */

import { z } from "zod";
import { ExtractRunsClient as GeneratedExtractRunsClient } from "../../../api/resources/extractRuns/client/Client";
import * as Extend from "../../../api";
import {
  pollUntilDone,
  PollingOptions,
  PollingTimeoutError,
} from "../../utilities/polling";
import {
  TypedExtractConfig,
  isTypedConfig,
  convertTypedConfigToApiConfig,
} from "../../schema/configConversion";

export { PollingTimeoutError };

export interface CreateAndPollOptions extends PollingOptions {
  /**
   * Request options passed to both create and retrieve calls.
   */
  requestOptions?: GeneratedExtractRunsClient.RequestOptions;
}

/**
 * Extractor reference with typed overrideConfig.
 * Use this when overriding an existing extractor's config with a typed schema.
 */
export interface TypedExtractorReference<T extends z.ZodRawShape> {
  /** The ID of the extractor to use (e.g., "extractor_abc123"). */
  id: string;
  /**
   * Optional version of the extractor to use.
   * If not provided, the latest published version will be used.
   */
  version?: Extend.ProcessorVersionString;
  /**
   * Typed configuration override for this extractor.
   * The extraction output will be fully typed based on the schema you provide.
   */
  overrideConfig: TypedExtractConfig<T>;
}

/**
 * Request type for typed extraction with inline config.
 * Use this when providing a typed schema directly via `config.schema`.
 */
export interface TypedExtractRunsCreateRequestWithConfig<
  T extends z.ZodRawShape,
> extends Omit<Extend.ExtractRunsCreateRequest, "config" | "extractor"> {
  /**
   * Inline extract configuration with typed schema.
   * The extraction output will be fully typed based on the schema you provide.
   */
  config: TypedExtractConfig<T>;
  extractor?: never;
}

/**
 * Request type for typed extraction with extractor.overrideConfig.
 * Use this when overriding an existing extractor's config with a typed schema.
 */
export interface TypedExtractRunsCreateRequestWithExtractor<
  T extends z.ZodRawShape,
> extends Omit<Extend.ExtractRunsCreateRequest, "config" | "extractor"> {
  /**
   * Reference to an existing extractor with typed configuration override.
   * The extraction output will be fully typed based on the schema in overrideConfig.
   */
  extractor: TypedExtractorReference<T>;
  config?: never;
}

/**
 * Union of both typed request forms.
 */
export type TypedExtractRunsCreateRequest<T extends z.ZodRawShape> =
  | TypedExtractRunsCreateRequestWithConfig<T>
  | TypedExtractRunsCreateRequestWithExtractor<T>;

/**
 * Typed extract output where value matches the schema.
 */
export interface TypedExtractOutput<T> {
  value: T;
  metadata: Extend.ExtractOutputMetadata;
}

/**
 * Typed extract run with output matching the schema.
 */
export interface TypedExtractRun<T> extends Omit<
  Extend.ExtractRun,
  "output" | "initialOutput" | "reviewedOutput"
> {
  output: TypedExtractOutput<T> | null;
  initialOutput: TypedExtractOutput<T> | null;
  reviewedOutput: TypedExtractOutput<T> | null;
}

/**
 * Check if a ProcessorRunStatus is terminal (no longer processing).
 * We check for non-terminal states rather than terminal states so that
 * if new terminal states are added, polling will still complete.
 */
function isTerminalStatus(status: Extend.ProcessorRunStatus): boolean {
  return status !== "PROCESSING" && status !== "PENDING";
}

export class ExtractRunsClient extends GeneratedExtractRunsClient {
  /**
   * Creates an extract run and polls until it reaches a terminal state.
   *
   * This is a convenience method that combines `create()` and polling via
   * `retrieve()` with exponential backoff and jitter.
   *
   * Terminal states: PROCESSED, FAILED, CANCELLED
   *
   * @param request - The extract run creation request
   * @param options - Polling and request options
   * @returns The final extract run when processing is complete
   * @throws {PollingTimeoutError} If the run doesn't complete within maxWaitMs
   *
   * @example
   * ```typescript
   * // Basic usage (untyped)
   * const result = await client.extractRuns.createAndPoll({
   *   file: { url: "https://example.com/doc.pdf" },
   *   extractor: { id: "extractor_abc123" }
   * });
   *
   * // With typed inline config (zod schema)
   * const result = await client.extractRuns.createAndPoll({
   *   file: { url: "..." },
   *   config: {
   *     schema: z.object({
   *       name: z.string().nullable(),
   *       amount: extendCurrency(),
   *     }),
   *     baseProcessor: "extraction_performance",
   *   },
   * });
   *
   * // result.output.value is typed!
   * console.log(result.output.value.name); // string | null
   * console.log(result.output.value.amount.amount); // number | null
   * ```
   */

  // Overload 1: Typed inline config - returns typed response
  public async createAndPoll<T extends z.ZodRawShape>(
    request: TypedExtractRunsCreateRequestWithConfig<T>,
    options?: CreateAndPollOptions,
  ): Promise<TypedExtractRun<z.infer<z.ZodObject<T>>>>;

  // Overload 2: Typed extractor.overrideConfig - returns typed response
  public async createAndPoll<T extends z.ZodRawShape>(
    request: TypedExtractRunsCreateRequestWithExtractor<T>,
    options?: CreateAndPollOptions,
  ): Promise<TypedExtractRun<z.infer<z.ZodObject<T>>>>;

  // Overload 3: Standard request - returns standard response
  public async createAndPoll(
    request: Extend.ExtractRunsCreateRequest,
    options?: CreateAndPollOptions,
  ): Promise<Extend.ExtractRun>;

  // Implementation
  public async createAndPoll<T extends z.ZodRawShape>(
    request: TypedExtractRunsCreateRequest<T> | Extend.ExtractRunsCreateRequest,
    options: CreateAndPollOptions = {},
  ): Promise<TypedExtractRun<z.infer<z.ZodObject<T>>> | Extend.ExtractRun> {
    const {
      maxWaitMs,
      initialDelayMs,
      maxDelayMs,
      jitterFraction,
      requestOptions,
    } = options;

    // Convert typed schema to API format if needed
    const apiRequest = this.convertToApiRequest(request);

    // Create the extract run
    const createResponse = await this.create(apiRequest, requestOptions);
    const runId = createResponse.id;

    // Poll until terminal state
    const result = await pollUntilDone(
      () => this.retrieve(runId, requestOptions),
      (response) => isTerminalStatus(response.status),
      { maxWaitMs, initialDelayMs, maxDelayMs, jitterFraction },
    );

    // Return result - TypeScript will infer the correct type based on the overload
    return result as TypedExtractRun<z.infer<z.ZodObject<T>>>;
  }

  /**
   * Converts a potentially typed request to the standard API request format.
   */
  private convertToApiRequest<T extends z.ZodRawShape>(
    request: TypedExtractRunsCreateRequest<T> | Extend.ExtractRunsCreateRequest,
  ): Extend.ExtractRunsCreateRequest {
    // Case 1: Typed inline config
    if (
      "config" in request &&
      request.config &&
      isTypedConfig(request.config)
    ) {
      return {
        file: request.file,
        priority: request.priority,
        metadata: request.metadata,
        config: convertTypedConfigToApiConfig(request.config),
      };
    }

    // Case 2: Typed extractor.overrideConfig
    if (
      "extractor" in request &&
      request.extractor &&
      "overrideConfig" in request.extractor
    ) {
      const extractor = request.extractor;
      if (isTypedConfig(extractor.overrideConfig)) {
        return {
          file: request.file,
          priority: request.priority,
          metadata: request.metadata,
          extractor: {
            id: extractor.id,
            version: extractor.version,
            overrideConfig: convertTypedConfigToApiConfig(
              extractor.overrideConfig,
            ),
          },
        };
      }
    }

    // Case 3: Standard request (no typed schema)
    return request as Extend.ExtractRunsCreateRequest;
  }
}
