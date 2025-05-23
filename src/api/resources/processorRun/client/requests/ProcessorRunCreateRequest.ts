/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Extend from "../../../../index";

/**
 * @example
 *     {
 *         processorId: "processor_id_here"
 *     }
 */
export interface ProcessorRunCreateRequest {
    processorId: Extend.ProcessorId;
    /**
     * An optional version of the processor to use. When not supplied, the most recent published version of the processor will be used. Special values include:
     * - `"latest"` for the most recent published version. If there are no published versions, the draft version will be used.
     * - `"draft"` for the draft version.
     * - Specific version numbers corresponding to versions your team has published, e.g. `"1.0"`, `"2.2"`, etc.
     */
    version?: string;
    /** The file to be processed. One of `file` or `rawText` must be provided. Supported file types can be found [here](https://docs.extend.ai/2025-04-21/developers/guides/supported-file-types). */
    file?: Extend.ProcessorRunFileInput;
    /** A raw string to be processed. Can be used in place of file when passing raw text data streams. One of `file` or `rawText` must be provided. */
    rawText?: string;
    /** An optional value used to determine the relative order of ProcessorRuns when rate limiting is in effect. Lower values will be prioritized before higher values. */
    priority?: number;
    /** An optional object that can be passed in to identify the run of the document processor. It will be returned back to you in the response and webhooks. */
    metadata?: Extend.JsonObject;
    /** The configuration for the processor run. If this is provided, this config will be used. If not provided, the config for the specific version you provide will be used. The type of configuration must match the processor type. */
    config?: Extend.ProcessorRunCreateRequestConfig;
}
