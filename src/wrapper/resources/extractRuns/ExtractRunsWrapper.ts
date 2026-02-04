/**
 * Extended ExtractRuns client with polling utilities and typed responses.
 *
 * @example
 * ```typescript
 * import { ExtendClient, extendSchema, extendDate, extendCurrency } from "extend-ai";
 * import { z } from "zod";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * // Define a typed schema
 * const InvoiceSchema = extendSchema({
 *   invoice_number: z.string().nullable().describe("The invoice number"),
 *   invoice_date: extendDate().describe("The invoice date"),
 *   total: extendCurrency().describe("Total amount"),
 * });
 *
 * // Option 1: Use inline config with schema
 * const result = await client.extractRuns.createAndPoll({
 *   file: { url: "https://example.com/invoice.pdf" },
 *   config: {
 *     schema: InvoiceSchema,
 *     baseProcessor: "extraction_performance",
 *   },
 * });
 *
 * // Option 2: Use extractor with overrideConfig
 * const result = await client.extractRuns.createAndPoll({
 *   file: { url: "https://example.com/invoice.pdf" },
 *   extractor: {
 *     id: "extractor_abc123",
 *     overrideConfig: {
 *       schema: InvoiceSchema,
 *       baseProcessor: "extraction_performance",
 *     },
 *   },
 * });
 *
 * // output.value is fully typed in both cases!
 * console.log(result.extractRun.output.value.invoice_number); // string | null
 * console.log(result.extractRun.output.value.total.amount); // number | null
 * ```
 */

import { z } from "zod";
import { ExtractRuns } from "../../../api/resources/extractRuns/client/Client";
import * as Extend from "../../../api";
import { pollUntilDone, PollingOptions, PollingTimeoutError } from "../../utilities/polling";
import { ExtendSchemaWrapper, InferExtendSchema, EXTEND_SCHEMA_MARKER } from "../../schema/types";
import { ExtractRunFailedError } from "../../errors";

export { PollingTimeoutError };

export interface CreateAndPollOptions extends PollingOptions {
    /**
     * Request options passed to both create and retrieve calls.
     */
    requestOptions?: ExtractRuns.RequestOptions;
}

/**
 * Typed extraction config that uses an ExtendSchemaWrapper for the schema property.
 * This provides full TypeScript inference for extraction output based on your Zod schema.
 */
export interface TypedExtractConfig<T extends z.ZodRawShape> {
    /**
     * Typed JSON Schema definition of the data to extract, created with `extendSchema()`.
     * The extraction output will be fully typed based on this schema.
     *
     * @example
     * ```typescript
     * const schema = extendSchema({
     *   invoice_number: z.string().nullable(),
     *   total: extendCurrency(),
     * });
     * ```
     */
    schema: ExtendSchemaWrapper<T>;
    /**
     * The base processor to use. For extractors, this can be either `"extraction_performance"` or `"extraction_light"`.
     * Defaults to `"extraction_performance"` if not provided.
     * See [Extraction Changelog](https://docs.extend.ai/2026-01-01/changelog/extraction/extraction-performance) for more details.
     */
    baseProcessor: Extend.ExtractConfigJsonBaseProcessor;
    /**
     * The version of the `"extraction_performance"` or `"extraction_light"` processor to use.
     * If not provided, the latest stable version for the selected `baseProcessor` will be used automatically.
     * See [Extraction Changelog](https://docs.extend.ai/2026-01-01/changelog/extraction/extraction-performance) for more details.
     */
    baseVersion?: string;
    /** Custom rules to guide the extraction process in natural language. */
    extractionRules?: string;
    /** Advanced configuration options. */
    advancedOptions?: Extend.ExtractAdvancedOptions;
    /** Configuration options for the parsing process. */
    parseConfig?: Extend.ParseConfig;
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
export interface TypedExtractRunsCreateRequestWithConfig<T extends z.ZodRawShape>
    extends Omit<Extend.ExtractRunsCreateRequest, "config" | "extractor"> {
    /**
     * Inline extract configuration with typed schema.
     * The extraction output will be fully typed based on the schema you provide.
     *
     * @example
     * ```typescript
     * config: {
     *   schema: extendSchema({ invoice_number: z.string().nullable() }),
     *   baseProcessor: "extraction_performance",
     * }
     * ```
     */
    config: TypedExtractConfig<T>;
    extractor?: never;
}

/**
 * Request type for typed extraction with extractor.overrideConfig.
 * Use this when overriding an existing extractor's config with a typed schema.
 */
export interface TypedExtractRunsCreateRequestWithExtractor<T extends z.ZodRawShape>
    extends Omit<Extend.ExtractRunsCreateRequest, "config" | "extractor"> {
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
export interface TypedExtractRun<T> extends Omit<Extend.ExtractRun, "output" | "initialOutput" | "reviewedOutput"> {
    output: TypedExtractOutput<T>;
    initialOutput: TypedExtractOutput<T>;
    reviewedOutput: TypedExtractOutput<T>;
}

/**
 * Typed response for createAndPoll when a schema is provided.
 */
export interface TypedExtractRunsRetrieveResponse<T> {
    extractRun: TypedExtractRun<T>;
}

/**
 * Type guard to check if a value is an ExtendSchemaWrapper.
 */
function isExtendSchemaWrapper(value: unknown): value is ExtendSchemaWrapper<z.ZodRawShape> {
    return (
        typeof value === "object" &&
        value !== null &&
        EXTEND_SCHEMA_MARKER in value &&
        (value as Record<symbol, unknown>)[EXTEND_SCHEMA_MARKER] === true
    );
}

/**
 * Type guard to check if a config has a typed schema property.
 */
function isTypedConfig(config: unknown): config is TypedExtractConfig<z.ZodRawShape> {
    return (
        typeof config === "object" &&
        config !== null &&
        "schema" in config &&
        isExtendSchemaWrapper((config as { schema: unknown }).schema)
    );
}

/**
 * Check if a ProcessorRunStatus is terminal (no longer processing).
 * We check for non-terminal states rather than terminal states so that
 * if new terminal states are added, polling will still complete.
 */
function isTerminalStatus(status: Extend.ProcessorRunStatus): boolean {
    // @ts-expect-error PENDING status does not exist in the API yet but we want to be future-proof
    // Can remove this once PENDING is added to the API
    return status !== "PROCESSING" && status !== "PENDING";
}

/**
 * Converts a typed config to the standard API config format.
 */
function convertTypedConfigToApiConfig(config: TypedExtractConfig<z.ZodRawShape>): Extend.ExtractConfigJson {
    return {
        baseProcessor: config.baseProcessor,
        baseVersion: config.baseVersion,
        extractionRules: config.extractionRules,
        advancedOptions: config.advancedOptions,
        parseConfig: config.parseConfig,
        schema: config.schema.jsonSchema as Extend.JsonObject,
    };
}

export class ExtractRunsWrapper extends ExtractRuns {
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
     * @param options.throwOnFailure - If true, throws ExtractRunFailedError on FAILED status
     * @returns The final extract run response when processing is complete
     * @throws {PollingTimeoutError} If the run doesn't complete within maxWaitMs
     * @throws {ExtractRunFailedError} If throwOnFailure is true and status is FAILED
     *
     * @example
     * ```typescript
     * // Basic usage (untyped)
     * const result = await client.extractRuns.createAndPoll({
     *   file: { url: "https://example.com/doc.pdf" },
     *   extractor: { id: "extractor_abc123" }
     * });
     *
     * // With typed inline config
     * const schema = extendSchema({
     *   name: z.string().nullable(),
     *   amount: extendCurrency(),
     * });
     *
     * const result = await client.extractRuns.createAndPoll({
     *   file: { url: "..." },
     *   config: {
     *     schema,
     *     baseProcessor: "extraction_performance",
     *   },
     * });
     *
     * // With typed extractor.overrideConfig
     * const result = await client.extractRuns.createAndPoll({
     *   file: { url: "..." },
     *   extractor: {
     *     id: "extractor_abc123",
     *     overrideConfig: {
     *       schema,
     *       baseProcessor: "extraction_performance",
     *     },
     *   },
     * });
     *
     * // result.extractRun.output.value is typed in both cases!
     * ```
     *
     * @example
     * ```typescript
     * try {
     *   const result = await client.extractRuns.createAndPoll(
     *     { file: { url: "https://example.com/doc.pdf" }, extractor: { id: "extractor_abc123" } },
     *     { throwOnFailure: true },
     *   );
     *   console.log(result.extractRun.output.value);
     * } catch (error) {
     *   if (error instanceof ExtractRunFailedError) {
     *     console.log(error.failureReason);
     *   }
     * }
     * ```
     */

    // Overload 1: Typed inline config - returns typed response
    public async createAndPoll<T extends z.ZodRawShape>(
        request: TypedExtractRunsCreateRequestWithConfig<T>,
        options?: CreateAndPollOptions,
    ): Promise<TypedExtractRunsRetrieveResponse<InferExtendSchema<ExtendSchemaWrapper<T>>>>;

    // Overload 2: Typed extractor.overrideConfig - returns typed response
    public async createAndPoll<T extends z.ZodRawShape>(
        request: TypedExtractRunsCreateRequestWithExtractor<T>,
        options?: CreateAndPollOptions,
    ): Promise<TypedExtractRunsRetrieveResponse<InferExtendSchema<ExtendSchemaWrapper<T>>>>;

    // Overload 3: Standard request - returns standard response
    public async createAndPoll(
        request: Extend.ExtractRunsCreateRequest,
        options?: CreateAndPollOptions,
    ): Promise<Extend.ExtractRunsRetrieveResponse>;

    // Implementation
    public async createAndPoll<T extends z.ZodRawShape>(
        request: TypedExtractRunsCreateRequest<T> | Extend.ExtractRunsCreateRequest,
        options: CreateAndPollOptions = {},
    ): Promise<
        TypedExtractRunsRetrieveResponse<InferExtendSchema<ExtendSchemaWrapper<T>>> | Extend.ExtractRunsRetrieveResponse
    > {
        const { requestOptions, throwOnFailure, ...pollingOptions } = options;

        // Convert typed schema to API format if needed
        const apiRequest = this.convertToApiRequest(request);

        // Create the extract run
        const createResponse = await this.create(apiRequest, requestOptions);
        const runId = createResponse.extractRun.id;

        // Poll until terminal state
        const result = await pollUntilDone(
            () => this.retrieve(runId, requestOptions),
            (response) => isTerminalStatus(response.extractRun.status),
            pollingOptions,
        );

        if (throwOnFailure && result.extractRun.status === "FAILED") {
            throw new ExtractRunFailedError(result as Extend.ExtractRunsRetrieveResponse);
        }

        // Return result - TypeScript will infer the correct type based on the overload
        return result as TypedExtractRunsRetrieveResponse<InferExtendSchema<ExtendSchemaWrapper<T>>>;
    }

    /**
     * Converts a potentially typed request to the standard API request format.
     */
    private convertToApiRequest<T extends z.ZodRawShape>(
        request: TypedExtractRunsCreateRequest<T> | Extend.ExtractRunsCreateRequest,
    ): Extend.ExtractRunsCreateRequest {
        // Case 1: Typed inline config
        if ("config" in request && request.config && isTypedConfig(request.config)) {
            return {
                file: request.file,
                priority: request.priority,
                metadata: request.metadata,
                config: convertTypedConfigToApiConfig(request.config),
            };
        }

        // Case 2: Typed extractor.overrideConfig
        if ("extractor" in request && request.extractor && "overrideConfig" in request.extractor) {
            const extractor = request.extractor;
            if (isTypedConfig(extractor.overrideConfig)) {
                return {
                    file: request.file,
                    priority: request.priority,
                    metadata: request.metadata,
                    extractor: {
                        id: extractor.id,
                        version: extractor.version,
                        overrideConfig: convertTypedConfigToApiConfig(extractor.overrideConfig),
                    },
                };
            }
        }

        // Case 3: Standard request (no typed schema)
        return request as Extend.ExtractRunsCreateRequest;
    }
}
