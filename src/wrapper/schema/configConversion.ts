/**
 * Shared utilities for detecting and converting typed Zod configs to API format.
 *
 * Used by ExtendClient.extract(), ExtractRunsClient.createAndPoll(),
 * ExtractorsClient.create()/update(), and ExtractorVersionsClient.create().
 */

import { z } from "zod";
import * as Extend from "../../api";
import { zodToExtendSchema } from "./zodToExtendSchema";

/**
 * Typed extraction config that accepts a Zod object schema directly.
 * This provides full TypeScript inference for extraction output based on your Zod schema.
 *
 * Used across extract runs, extractors, and extractor version endpoints.
 *
 * @example
 * ```typescript
 * config: {
 *   schema: z.object({
 *     invoice_number: z.string().nullable(),
 *     total: extendCurrency(),
 *   }),
 *   baseProcessor: "extraction_performance",
 * }
 * ```
 */
export interface TypedExtractConfig<T extends z.ZodRawShape> {
  /**
   * Zod object schema defining the data to extract.
   * The extraction output will be fully typed based on this schema.
   */
  schema: z.ZodObject<T>;
  /**
   * The base processor to use. For extractors, this can be either `"extraction_performance"` or `"extraction_light"`.
   * Defaults to `"extraction_performance"` if not provided.
   */
  baseProcessor?: Extend.ExtractConfigJsonBaseProcessor;
  /**
   * The version of the `"extraction_performance"` or `"extraction_light"` processor to use.
   * If not provided, the latest stable version for the selected `baseProcessor` will be used automatically.
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
 * Type guard to check if a value is a ZodObject.
 */
export function isZodObject(
  value: unknown
): value is z.ZodObject<z.ZodRawShape> {
  return value instanceof z.ZodObject;
}

/**
 * Type guard to check if a config has a zod schema property.
 */
export function isTypedConfig(
  config: unknown
): config is TypedExtractConfig<z.ZodRawShape> {
  return (
    typeof config === "object" &&
    config !== null &&
    "schema" in config &&
    isZodObject((config as { schema: unknown }).schema)
  );
}

/**
 * Converts a typed config (with Zod schema) to the standard API config format (JSON Schema).
 */
export function convertTypedConfigToApiConfig(
  config: TypedExtractConfig<z.ZodRawShape>
): Extend.ExtractConfigJson {
  // Convert zod schema to JSON schema at call time
  const jsonSchema = zodToExtendSchema(config.schema);

  return {
    baseProcessor: config.baseProcessor,
    baseVersion: config.baseVersion,
    extractionRules: config.extractionRules,
    advancedOptions: config.advancedOptions,
    parseConfig: config.parseConfig,
    schema: jsonSchema as Extend.JsonObject,
  };
}
