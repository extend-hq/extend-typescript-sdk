/**
 * Schema utilities for typed extraction responses.
 *
 * This module provides custom type helpers for defining extraction schemas using Zod.
 * Use these alongside standard zod types in your schema definitions.
 *
 * @example
 * ```typescript
 * import { ExtendClient, extendDate, extendCurrency } from "extend-ai";
 * import { z } from "zod";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * // Use zod directly with custom type helpers
 * const result = await client.extract({
 *   file: { url: "https://example.com/invoice.pdf" },
 *   config: {
 *     schema: z.object({
 *       invoice_number: z.string().nullable().describe("The invoice number"),
 *       invoice_date: extendDate().describe("The invoice date"),
 *       total: extendCurrency().describe("Total amount"),
 *       line_items: z.array(z.object({
 *         description: z.string().nullable(),
 *         quantity: z.number().nullable(),
 *         price: z.number().nullable(),
 *       })).describe("Line items"),
 *     }),
 *     baseProcessor: "extraction_performance",
 *   },
 * });
 *
 * // TypeScript knows the exact shape of output
 * console.log(result.output.value.invoice_number); // string | null
 * console.log(result.output.value.total.amount); // number | null
 * ```
 */

// Re-export custom type helpers
export { extendDate, extendCurrency, extendSignature } from "./customTypes";

// Re-export types for advanced usage
export type { CurrencyValue, SignatureValue } from "./types";

// Re-export conversion utilities (for internal use)
export { zodToExtendSchema, SchemaConversionError } from "./zodToExtendSchema";

// Re-export shared config conversion utilities
export {
  isZodObject,
  isTypedConfig,
  convertTypedConfigToApiConfig,
} from "./configConversion";
export type { TypedExtractConfig } from "./configConversion";
