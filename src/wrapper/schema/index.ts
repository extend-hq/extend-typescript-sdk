/**
 * Schema utilities for typed extraction responses.
 *
 * This module provides helpers for defining extraction schemas using Zod,
 * which are then converted to Extend's JSON Schema format. The key benefit
 * is that the extraction response will be fully typed based on your schema.
 *
 * @example
 * ```typescript
 * import { ExtendClient, extendSchema, extendDate, extendCurrency } from "extend-ai";
 *
 * // Define your schema
 * const InvoiceSchema = extendSchema({
 *   invoice_number: z.string().nullable().describe("The invoice number"),
 *   invoice_date: extendDate().describe("The invoice date"),
 *   total: extendCurrency().describe("Total amount"),
 *   line_items: z.array(z.object({
 *     description: z.string().nullable(),
 *     quantity: z.number().nullable(),
 *     price: z.number().nullable(),
 *   })).describe("Line items"),
 * });
 *
 * // Use with createAndPoll - response is fully typed!
 * const result = await client.extractRuns.createAndPoll({
 *   file: { url: "https://example.com/invoice.pdf" },
 *   config: InvoiceSchema,
 * });
 *
 * // TypeScript knows the exact shape of output
 * console.log(result.extractRun.output.value.invoice_number); // string | null
 * console.log(result.extractRun.output.value.total.amount); // number | null
 * ```
 */

import { z } from "zod";
import { ExtendSchemaWrapper, ExtendRootJSONSchema, EXTEND_SCHEMA_MARKER } from "./types";
import { zodToExtendSchema, SchemaConversionError } from "./zodToExtendSchema";
import { extendDate, extendCurrency, extendSignature } from "./customTypes";

// Re-export custom type helpers
export { extendDate, extendCurrency, extendSignature };

// Re-export types
export type { ExtendSchemaWrapper, ExtendRootJSONSchema, InferExtendSchema } from "./types";
export { SchemaConversionError } from "./zodToExtendSchema";
export { EXTEND_SCHEMA_MARKER } from "./types";

/**
 * Creates a typed extraction schema from a Zod object shape.
 *
 * This function wraps your Zod schema and converts it to Extend's JSON Schema
 * format. When used with `createAndPoll`, the response will be fully typed.
 *
 * @param shape - An object containing Zod schemas for each field
 * @returns A wrapped schema that can be used with extraction methods
 *
 * @example
 * ```typescript
 * const schema = extendSchema({
 *   name: z.string().nullable().describe("Customer name"),
 *   age: z.number().nullable().describe("Customer age"),
 *   status: z.enum(["active", "inactive"]).describe("Account status"),
 * });
 * ```
 *
 * @remarks
 * **Schema Requirements:**
 * - Root must be an object (handled automatically)
 * - All primitive fields should be nullable (use `.nullable()`)
 * - Maximum nesting level is 3
 * - Enums must be string-only
 * - Property keys can only contain letters, numbers, underscores, and hyphens
 *
 * **Custom Types:**
 * Use `extendDate()`, `extendCurrency()`, and `extendSignature()` for
 * special field types that receive enhanced processing.
 */
export function extendSchema<T extends z.ZodRawShape>(shape: T): ExtendSchemaWrapper<T> {
    const zodSchema = z.object(shape);
    const jsonSchema = zodToExtendSchema(zodSchema);

    return {
        [EXTEND_SCHEMA_MARKER]: true,
        _zodSchema: zodSchema,
        jsonSchema,
        _output: undefined as unknown as z.infer<z.ZodObject<T>>,
    };
}

/**
 * Type guard to check if a value is an ExtendSchemaWrapper.
 */
export function isExtendSchema(value: unknown): value is ExtendSchemaWrapper<z.ZodRawShape> {
    return (
        typeof value === "object" &&
        value !== null &&
        EXTEND_SCHEMA_MARKER in value &&
        (value as Record<symbol, unknown>)[EXTEND_SCHEMA_MARKER] === true
    );
}

/**
 * Extracts the JSON Schema from an ExtendSchemaWrapper.
 * This is used internally when making API requests.
 */
export function getJsonSchema(wrapper: ExtendSchemaWrapper<z.ZodRawShape>): ExtendRootJSONSchema {
    return wrapper.jsonSchema;
}
