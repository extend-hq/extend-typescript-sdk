/**
 * Type definitions for Extend's JSON Schema format.
 */

import { z } from "zod";

/**
 * Marker symbol to identify Extend schema wrappers.
 */
export const EXTEND_SCHEMA_MARKER: unique symbol = Symbol("ExtendSchema");

/**
 * Wrapper that holds both the Zod schema (for TypeScript inference)
 * and the converted Extend JSON Schema (for the API).
 */
export interface ExtendSchemaWrapper<T extends z.ZodRawShape> {
    [EXTEND_SCHEMA_MARKER]: true;
    /** The original Zod schema for type inference */
    _zodSchema: z.ZodObject<T>;
    /** The converted JSON Schema for the Extend API */
    jsonSchema: ExtendRootJSONSchema;
    /** Inferred TypeScript type (phantom type for inference) */
    _output: z.infer<z.ZodObject<T>>;
}

/**
 * Extract the output type from an ExtendSchemaWrapper.
 */
export type InferExtendSchema<T> = T extends ExtendSchemaWrapper<infer S> ? z.infer<z.ZodObject<S>> : never;

// ============================================================================
// Extend JSON Schema Types (matching the API's expected format)
// ============================================================================

export type ExtendRootJSONSchema = {
    type: "object";
    properties: Record<string, ExtendJSONSchema>;
    required: string[];
    additionalProperties?: boolean;
};

type BaseJSONSchema = {
    "extend:name"?: string;
    description?: string;
};

export type ExtendEnumJSONSchema = BaseJSONSchema & {
    enum: (string | null)[];
    "extend:descriptions"?: string[];
};

export type ExtendStringJSONSchema = BaseJSONSchema & {
    type: ["string", "null"];
    "extend:type"?: "date";
};

export type ExtendNumberJSONSchema = BaseJSONSchema & {
    type: ["number", "null"];
};

export type ExtendIntegerJSONSchema = BaseJSONSchema & {
    type: ["integer", "null"];
};

export type ExtendBooleanJSONSchema = BaseJSONSchema & {
    type: ["boolean", "null"];
};

export type ExtendArrayJSONSchema = BaseJSONSchema & {
    type: "array";
    items:
        | ExtendObjectJSONSchema
        | { type: "string"; "extend:type"?: "date" }
        | { type: "number" }
        | { type: "integer" }
        | { type: "boolean" };
};

export type ExtendObjectJSONSchema = BaseJSONSchema & {
    type: "object";
    "extend:type"?: "currency" | "signature";
    properties: Record<string, ExtendJSONSchema>;
    required: string[];
    additionalProperties?: boolean;
};

export type ExtendJSONSchema =
    | ExtendEnumJSONSchema
    | ExtendStringJSONSchema
    | ExtendNumberJSONSchema
    | ExtendIntegerJSONSchema
    | ExtendBooleanJSONSchema
    | ExtendArrayJSONSchema
    | ExtendObjectJSONSchema;

// ============================================================================
// Custom Type Markers (for extend:type fields)
// ============================================================================

/**
 * Marker for date fields that will use extend:type: "date"
 */
export const DATE_TYPE_MARKER: unique symbol = Symbol("ExtendDate");

/**
 * Marker for currency fields that will use extend:type: "currency"
 */
export const CURRENCY_TYPE_MARKER: unique symbol = Symbol("ExtendCurrency");

/**
 * Marker for signature fields that will use extend:type: "signature"
 */
export const SIGNATURE_TYPE_MARKER: unique symbol = Symbol("ExtendSignature");

/**
 * Currency output type
 */
export type CurrencyValue = {
    amount: number | null;
    iso_4217_currency_code: string | null;
};

/**
 * Signature output type
 */
export type SignatureValue = {
    printed_name: string | null;
    signature_date: string | null;
    is_signed: boolean | null;
    title_or_role: string | null;
};
