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
export interface TypedExtractConfig<T extends z.ZodRawShape>
  extends Omit<Extend.ExtractConfigJson, "schema"> {
  /**
   * Zod object schema defining the data to extract.
   * The extraction output will be fully typed based on this schema.
   */
  schema: z.ZodObject<T>;
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
  const { schema, ...rest } = config;
  const jsonSchema = zodToExtendSchema(schema);

  return {
    ...rest,
    schema: jsonSchema as Extend.JsonObject,
  };
}
