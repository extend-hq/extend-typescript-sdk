/**
 * Custom Zod types for Extend-specific field types.
 *
 * These create Zod schemas that will be converted to our extend:type fields.
 */

import { z } from "zod";
import { DATE_TYPE_MARKER, CURRENCY_TYPE_MARKER, SIGNATURE_TYPE_MARKER } from "./types";

/**
 * Helper to attach an extend type marker to a schema and wrap methods that return
 * new schema instances (like .describe(), .optional(), .nullable()) to preserve
 * the marker on the new instance.
 */
function attachExtendType<T extends z.ZodType, M extends symbol>(schema: T, marker: M): T & { _extendType: M } {
    // Attach the marker to this schema instance
    Object.defineProperty(schema, "_extendType", {
        value: marker,
        writable: false,
        enumerable: false,
        configurable: false,
    });

    // Wrap .describe() to preserve the marker on the new instance
    const originalDescribe = schema.describe.bind(schema);
    schema.describe = function (description: string) {
        const newSchema = originalDescribe(description);
        return attachExtendType(newSchema, marker);
    } as typeof schema.describe;

    // Wrap .optional() to preserve the marker on the new instance
    const originalOptional = schema.optional.bind(schema);
    schema.optional = function () {
        const newSchema = originalOptional();
        return attachExtendType(newSchema, marker);
    } as typeof schema.optional;

    // Wrap .nullable() to preserve the marker on the new instance
    const originalNullable = schema.nullable.bind(schema);
    schema.nullable = function () {
        const newSchema = originalNullable();
        return attachExtendType(newSchema, marker);
    } as typeof schema.nullable;

    return schema as T & { _extendType: M };
}

/**
 * Creates a date field schema.
 *
 * In the API, this becomes:
 * ```json
 * { "type": ["string", "null"], "extend:type": "date" }
 * ```
 *
 * The output will always be an ISO date string (yyyy-mm-dd) or null.
 *
 * @example
 * ```typescript
 * const schema = extendSchema({
 *   invoice_date: extendDate().describe("The invoice date"),
 * });
 * ```
 */
export function extendDate(): z.ZodNullable<z.ZodString> & { _extendType: typeof DATE_TYPE_MARKER } {
    return attachExtendType(z.string().nullable(), DATE_TYPE_MARKER);
}

/**
 * Creates a currency field schema.
 *
 * In the API, this becomes:
 * ```json
 * {
 *   "type": "object",
 *   "extend:type": "currency",
 *   "properties": {
 *     "amount": { "type": ["number", "null"] },
 *     "iso_4217_currency_code": { "type": ["string", "null"] }
 *   },
 *   "required": ["amount", "iso_4217_currency_code"]
 * }
 * ```
 *
 * @example
 * ```typescript
 * const schema = extendSchema({
 *   total_amount: extendCurrency().describe("Total invoice amount"),
 * });
 * ```
 */
export function extendCurrency(): z.ZodObject<{
    amount: z.ZodNullable<z.ZodNumber>;
    iso_4217_currency_code: z.ZodNullable<z.ZodString>;
}> & { _extendType: typeof CURRENCY_TYPE_MARKER } {
    const schema = z.object({
        amount: z.number().nullable(),
        iso_4217_currency_code: z.string().nullable(),
    });
    return attachExtendType(schema, CURRENCY_TYPE_MARKER);
}

/**
 * Creates a signature field schema.
 *
 * In the API, this becomes:
 * ```json
 * {
 *   "type": "object",
 *   "extend:type": "signature",
 *   "properties": {
 *     "printed_name": { "type": ["string", "null"] },
 *     "signature_date": { "type": ["string", "null"], "extend:type": "date" },
 *     "is_signed": { "type": ["boolean", "null"] },
 *     "title_or_role": { "type": ["string", "null"] }
 *   },
 *   "required": ["printed_name", "signature_date", "is_signed", "title_or_role"]
 * }
 * ```
 *
 * @example
 * ```typescript
 * const schema = extendSchema({
 *   customer_signature: extendSignature().describe("Customer's signature"),
 * });
 * ```
 */
export function extendSignature(): z.ZodObject<{
    printed_name: z.ZodNullable<z.ZodString>;
    signature_date: z.ZodNullable<z.ZodString>;
    is_signed: z.ZodNullable<z.ZodBoolean>;
    title_or_role: z.ZodNullable<z.ZodString>;
}> & { _extendType: typeof SIGNATURE_TYPE_MARKER } {
    const schema = z.object({
        printed_name: z.string().nullable(),
        signature_date: z.string().nullable(),
        is_signed: z.boolean().nullable(),
        title_or_role: z.string().nullable(),
    });
    return attachExtendType(schema, SIGNATURE_TYPE_MARKER);
}

/**
 * Type guard to check if a schema has an extend type marker.
 */
export function hasExtendType(schema: z.ZodType): schema is z.ZodType & { _extendType: symbol } {
    return "_extendType" in schema;
}

/**
 * Get the extend type marker from a schema, if present.
 */
export function getExtendType(schema: z.ZodType): symbol | undefined {
    if (hasExtendType(schema)) {
        return schema._extendType;
    }
    return undefined;
}
