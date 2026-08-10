/**
 * Converts Zod schemas to Extend's JSON Schema format.
 *
 * Primitive and enum object properties must be declared .nullable() (or equivalent
 * forms like .nullish() / z.union([T, z.null()])) — conversion throws otherwise.
 * That keeps z.infer aligned with the wire schema, which always allows null for
 * those fields, and mirrors the API's rejection of non-nullable primitives.
 *
 * Note: The API performs comprehensive validation and transformation of schemas.
 * This module focuses on structural conversion and compile-time type safety.
 * Complex validation (nesting limits, property counts, property key format) is handled server-side.
 */

import { z } from "zod";
import {
    ExtendRootJSONSchema,
    ExtendJSONSchema,
    ExtendObjectJSONSchema,
    ExtendArrayJSONSchema,
    ExtendStringJSONSchema,
    ExtendNumberJSONSchema,
    ExtendIntegerJSONSchema,
    ExtendBooleanJSONSchema,
    ExtendEnumJSONSchema,
    DATE_TYPE_MARKER,
    CURRENCY_TYPE_MARKER,
    SIGNATURE_TYPE_MARKER,
} from "./types";
import { getExtendType } from "./customTypes";

/**
 * Error thrown when a Zod schema cannot be converted to Extend JSON Schema.
 */
export class SchemaConversionError extends Error {
    public readonly path: string[];

    constructor(message: string, path: string[] = []) {
        super(path.length > 0 ? `${message} at path: ${path.join(".")}` : message);
        this.name = "SchemaConversionError";
        this.path = path;
    }
}

/**
 * Gets the Zod type name from a schema.
 */
function getZodTypeName(schema: z.ZodType): string {
    if ("type" in schema && typeof schema.type === "string") {
        return schema.type;
    }
    return "unknown";
}

/**
 * Type guard for string schema.
 */
function isZodString(schema: z.ZodType): schema is z.ZodString {
    return schema instanceof z.ZodString || getZodTypeName(schema) === "string";
}

/**
 * Type guard for number schema.
 */
function isZodNumber(schema: z.ZodType): schema is z.ZodNumber {
    return schema instanceof z.ZodNumber || getZodTypeName(schema) === "number";
}

/**
 * Type guard for boolean schema.
 */
function isZodBoolean(schema: z.ZodType): schema is z.ZodBoolean {
    return schema instanceof z.ZodBoolean || getZodTypeName(schema) === "boolean";
}

/**
 * Type guard for enum schema.
 */
function isZodEnum(schema: z.ZodType): boolean {
    return schema instanceof z.ZodEnum || getZodTypeName(schema) === "enum";
}

/**
 * Type guard for array schema.
 */
function isZodArray(schema: z.ZodType): schema is z.ZodArray<z.ZodType> {
    return schema instanceof z.ZodArray || getZodTypeName(schema) === "array";
}

/**
 * Type guard for object schema.
 */
function isZodObject(schema: z.ZodType): schema is z.ZodObject<z.ZodRawShape> {
    return schema instanceof z.ZodObject || getZodTypeName(schema) === "object";
}

/**
 * Type guard for literal schema.
 */
function isZodLiteral(schema: z.ZodType): boolean {
    return schema instanceof z.ZodLiteral || getZodTypeName(schema) === "literal";
}

/**
 * Type guard for nullable schema.
 */
function isZodNullable(schema: z.ZodType): schema is z.ZodNullable<z.ZodType> {
    return schema instanceof z.ZodNullable || getZodTypeName(schema) === "nullable";
}

/**
 * Type guard for optional schema.
 */
function isZodOptional(schema: z.ZodType): schema is z.ZodOptional<z.ZodType> {
    return schema instanceof z.ZodOptional || getZodTypeName(schema) === "optional";
}

/**
 * Type guard for default schema.
 */
function isZodDefault(schema: z.ZodType): schema is z.ZodDefault<z.ZodType> {
    return schema instanceof z.ZodDefault || getZodTypeName(schema) === "default";
}

/**
 * Type guard for null schema.
 */
function isZodNull(schema: z.ZodType): boolean {
    return schema instanceof z.ZodNull || getZodTypeName(schema) === "null";
}

/**
 * Type guard for union schema.
 */
function isZodUnion(schema: z.ZodType): boolean {
    return schema instanceof z.ZodUnion || getZodTypeName(schema) === "union";
}

/**
 * Checks if a ZodNumber has an integer constraint.
 */
function hasIntegerCheck(schema: z.ZodNumber): boolean {
    // Check if the schema has checks that include "int"
    if ("checks" in schema && Array.isArray(schema.checks)) {
        return schema.checks.some((check: { kind?: string }) => check.kind === "int");
    }
    // Fallback: check format property (used in some Zod versions)
    if ("format" in schema && schema.format === "safeint") {
        return true;
    }
    return false;
}

/**
 * Gets the inner type from a wrapper schema.
 */
function getInnerType(
    schema: z.ZodNullable<z.ZodType> | z.ZodOptional<z.ZodType> | z.ZodDefault<z.ZodType>,
): z.ZodType {
    return schema.unwrap();
}

/**
 * Gets union options when present.
 */
function getUnionOptions(schema: z.ZodType): z.ZodType[] | undefined {
    if ("options" in schema && Array.isArray(schema.options)) {
        return schema.options as z.ZodType[];
    }
    return undefined;
}

/**
 * If the schema is a two-member union of T | null, returns T; otherwise undefined.
 */
function getUnionNullInnerType(schema: z.ZodType): z.ZodType | undefined {
    if (!isZodUnion(schema)) {
        return undefined;
    }
    const options = getUnionOptions(schema);
    if (!options || options.length !== 2) {
        return undefined;
    }
    const nonNull = options.filter((option) => !isZodNull(option));
    const nullOptions = options.filter((option) => isZodNull(option));
    if (nonNull.length === 1 && nullOptions.length === 1) {
        return nonNull[0];
    }
    return undefined;
}

/**
 * Unwraps nullable, optional, default, and T | null union wrappers from a Zod type.
 */
function unwrapType(zodType: z.ZodType): {
    innerType: z.ZodType;
    isNullable: boolean;
    isOptional: boolean;
    description: string | undefined;
    meta: object | undefined;
} {
    let current: z.ZodType = zodType;
    let isNullable = false;
    let isOptional = false;
    // Track descriptions through the unwrapping chain (first one wins)
    let description: string | undefined = zodType.description;
    let meta: object | undefined = zodType.meta() ?? undefined;

    while (true) {
        if (isZodNullable(current)) {
            isNullable = true;
            current = getInnerType(current);
            description = description ?? current.description;
            meta = meta ?? current.meta();
        } else if (isZodOptional(current)) {
            isOptional = true;
            current = getInnerType(current);
            description = description ?? current.description;
            meta = meta ?? current.meta();
        } else if (isZodDefault(current)) {
            current = getInnerType(current);
            description = description ?? current.description;
            meta = meta ?? current.meta();
        } else {
            const unionInner = getUnionNullInnerType(current);
            if (unionInner) {
                isNullable = true;
                current = unionInner;
                description = description ?? current.description;
                meta = meta ?? current.meta();
            } else {
                break;
            }
        }
    }

    // Also check the final inner type for description
    description = description ?? current.description;
    meta = meta ?? current.meta();

    return { innerType: current, isNullable, isOptional, description, meta };
}
/**
 * Reads a string-valued extend keyword from schema metadata.
 * Unrelated keys and wrong-typed values are ignored.
 */
function getMetaString(meta: object | undefined, key: string): string | undefined {
    if (!meta) return undefined;
    for (const [metaKey, value] of Object.entries(meta)) {
        if (metaKey === key && typeof value === "string") {
            return value;
        }
    }
    return undefined;
}

/**
 * Reads a string-array extend keyword (e.g. "extend:descriptions") from schema metadata.
 */
function getMetaStringArray(meta: object | undefined, key: string): string[] | undefined {
    if (!meta) return undefined;
    for (const [metaKey, value] of Object.entries(meta)) {
        if (metaKey === key && Array.isArray(value) && value.every((item) => typeof item === "string")) {
            return value;
        }
    }
    return undefined;
}

/**
 * Gets the element type from a ZodArray.
 */
function getArrayElement(schema: z.ZodArray<z.ZodType>): z.ZodType {
    return schema.element as z.ZodType;
}

/**
 * Gets the shape from a ZodObject.
 */
function getObjectShape(schema: z.ZodObject<z.ZodRawShape>): z.ZodRawShape {
    return schema.shape;
}

/**
 * Gets the enum options from a ZodEnum.
 */
function getEnumOptions(schema: z.ZodType): readonly string[] {
    if ("options" in schema && Array.isArray(schema.options)) {
        return schema.options as readonly string[];
    }
    throw new SchemaConversionError("Unable to get options from enum schema");
}

/**
 * Gets the literal value from a ZodLiteral.
 */
function getLiteralValue(schema: z.ZodType): unknown {
    if ("value" in schema) {
        return schema.value;
    }
    throw new SchemaConversionError("Unable to get value from literal schema");
}

/**
 * Converts a Zod object schema to Extend's root JSON Schema format.
 *
 * @param zodSchema - A Zod object schema
 * @returns The converted Extend JSON Schema
 * @throws {SchemaConversionError} If the schema cannot be converted
 */
export function zodToExtendSchema(zodSchema: z.ZodObject<z.ZodRawShape>): ExtendRootJSONSchema {
    const shape = getObjectShape(zodSchema);
    const properties: Record<string, ExtendJSONSchema> = {};
    const required: string[] = [];

    for (const key of Object.keys(shape)) {
        const value = shape[key] as z.ZodType;
        properties[key] = convertZodType(value, [key], 0);
        // Extraction always returns every schema key (null when missing), so all
        // properties are required on the wire — including Zod .optional() fields.
        required.push(key);
    }

    return {
        type: "object",
        properties,
        required,
        additionalProperties: false,
    };
}

/**
 * Throws if a primitive or enum object property is not marked nullable.
 *
 * The API requires nullability for primitive and enum fields (missing values are
 * returned as null). Requiring .nullable() (or .nullish() / z.union([T, z.null()]))
 * keeps z.infer truthful instead of silently widening the wire schema.
 *
 * .optional() alone is not enough: it infers `T | undefined` while extraction returns null.
 */
function assertNullableProperty(isNullable: boolean, example: string, path: string[]): void {
    if (!isNullable) {
        throw new SchemaConversionError(
            `Primitive and enum fields must be .nullable() because the API returns null for missing values. Add .nullable() (e.g. ${example})`,
            path,
        );
    }
}

/**
 * Converts a Zod type to an Extend JSON Schema type.
 */
function convertZodType(zodType: z.ZodType, path: string[], depth: number): ExtendJSONSchema {
    // Unwrap nullable/optional wrappers, also collects description from any wrapper in the chain
    const { innerType, isNullable, description, meta } = unwrapType(zodType);

    // extend:* keywords live in .meta(); unrelated or wrong-typed keys are ignored
    const extendName = getMetaString(meta, "extend:name");
    const extendDescriptions = getMetaStringArray(meta, "extend:descriptions");

    // Check for custom extend types first
    const extendType = getExtendType(zodType) ?? getExtendType(innerType);

    if (extendType === DATE_TYPE_MARKER) {
        const result: ExtendStringJSONSchema = {
            type: ["string", "null"],
            "extend:type": "date",
        };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
        return result;
    }

    if (extendType === CURRENCY_TYPE_MARKER) {
        const result: ExtendObjectJSONSchema = {
            type: "object",
            "extend:type": "currency",
            properties: {
                amount: { type: ["number", "null"] },
                iso_4217_currency_code: { type: ["string", "null"] },
            },
            required: ["amount", "iso_4217_currency_code"],
            additionalProperties: false,
        };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
        return result;
    }

    if (extendType === SIGNATURE_TYPE_MARKER) {
        const result: ExtendObjectJSONSchema = {
            type: "object",
            "extend:type": "signature",
            properties: {
                printed_name: { type: ["string", "null"] },
                signature_date: { type: ["string", "null"], "extend:type": "date" },
                is_signed: { type: ["boolean", "null"] },
                title_or_role: { type: ["string", "null"] },
            },
            required: ["printed_name", "signature_date", "is_signed", "title_or_role"],
            additionalProperties: false,
        };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
        return result;
    }

    // Handle standard Zod types
    if (isZodString(innerType)) {
        assertNullableProperty(isNullable, "z.string().nullable()", path);
        const result: ExtendStringJSONSchema = { type: ["string", "null"] };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
        return result;
    }

    if (isZodNumber(innerType)) {
        // Check if it's an integer
        if (hasIntegerCheck(innerType)) {
            assertNullableProperty(isNullable, "z.number().int().nullable()", path);
            const result: ExtendIntegerJSONSchema = { type: ["integer", "null"] };
            if (description) result.description = description;
            if (extendName) result["extend:name"] = extendName;
            return result;
        }
        assertNullableProperty(isNullable, "z.number().nullable()", path);
        const result: ExtendNumberJSONSchema = { type: ["number", "null"] };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
        return result;
    }

    if (isZodBoolean(innerType)) {
        assertNullableProperty(isNullable, "z.boolean().nullable()", path);
        const result: ExtendBooleanJSONSchema = { type: ["boolean", "null"] };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
        return result;
    }

    if (isZodEnum(innerType)) {
        assertNullableProperty(isNullable, "z.enum([...]).nullable()", path);
        const enumValues = getEnumOptions(innerType);
        const enumWithNull: (string | null)[] = [...enumValues];
        if (!enumWithNull.includes(null)) {
            enumWithNull.push(null);
        }
        const result: ExtendEnumJSONSchema = { enum: enumWithNull };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
        if (extendDescriptions) result["extend:descriptions"] = extendDescriptions;
        return result;
    }

    if (isZodArray(innerType)) {
        const itemType = getArrayElement(innerType);
        const items = convertArrayItemType(itemType, path, depth);
        const result: ExtendArrayJSONSchema = { type: "array", items };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
        return result;
    }

    if (isZodObject(innerType)) {
        return convertObjectType(innerType, path, depth + 1, description, extendName);
    }

    if (isZodLiteral(innerType)) {
        const literalValue = getLiteralValue(innerType);
        if (typeof literalValue === "string") {
            assertNullableProperty(isNullable, `z.literal(${JSON.stringify(literalValue)}).nullable()`, path);
            const result: ExtendEnumJSONSchema = { enum: [literalValue, null] };
            if (description) result.description = description;
            if (extendName) result["extend:name"] = extendName;
            if (extendDescriptions) result["extend:descriptions"] = extendDescriptions;
            return result;
        }
        throw new SchemaConversionError(`Unsupported literal type: ${typeof literalValue}`, path);
    }

    // Get the type name for error message
    const typeName = getZodTypeName(innerType);
    throw new SchemaConversionError(`Unsupported Zod type: ${typeName}`, path);
}

/**
 * Converts array item types (which have different rules than top-level types).
 * Array items can be objects or primitive types, and primitive items are NOT nullable.
 */
function convertArrayItemType(itemType: z.ZodType, path: string[], depth: number): ExtendArrayJSONSchema["items"] {
    const { innerType, isNullable, isOptional } = unwrapType(itemType);
    const extendType = getExtendType(itemType) ?? getExtendType(innerType);

    // Handle custom types in arrays (markers short-circuit before nullability checks;
    // helpers like extendDate() are already nullable on the Zod side for object fields).
    if (extendType === DATE_TYPE_MARKER) {
        return { type: "string", "extend:type": "date" };
    }

    if (extendType === CURRENCY_TYPE_MARKER) {
        return {
            type: "object",
            "extend:type": "currency",
            properties: {
                amount: { type: ["number", "null"] },
                iso_4217_currency_code: { type: ["string", "null"] },
            },
            required: ["amount", "iso_4217_currency_code"],
            additionalProperties: false,
        };
    }

    if (extendType === SIGNATURE_TYPE_MARKER) {
        return {
            type: "object",
            "extend:type": "signature",
            properties: {
                printed_name: { type: ["string", "null"] },
                signature_date: { type: ["string", "null"], "extend:type": "date" },
                is_signed: { type: ["boolean", "null"] },
                title_or_role: { type: ["string", "null"] },
            },
            required: ["printed_name", "signature_date", "is_signed", "title_or_role"],
            additionalProperties: false,
        };
    }

    if (isNullable || isOptional) {
        throw new SchemaConversionError(
            "Array items cannot be .nullable() or .optional(); the API requires non-nullable item types. Use a bare primitive (e.g. z.string()) or object.",
            path,
        );
    }

    // Handle standard types for array items (non-nullable)
    if (isZodString(innerType)) {
        return { type: "string" };
    }

    if (isZodNumber(innerType)) {
        // Check if it's an integer
        if (hasIntegerCheck(innerType)) {
            return { type: "integer" };
        }
        return { type: "number" };
    }

    if (isZodBoolean(innerType)) {
        return { type: "boolean" };
    }

    if (isZodObject(innerType)) {
        return convertObjectType(innerType, path, depth + 1);
    }

    const typeName = getZodTypeName(innerType);
    throw new SchemaConversionError(
        `Unsupported array item type: ${typeName}. Array items must be objects or primitives (string, number, integer, boolean).`,
        path,
    );
}

/**
 * Converts a Zod object type to Extend JSON Schema object format.
 */
function convertObjectType(
    objectType: z.ZodObject<z.ZodRawShape>,
    path: string[],
    depth: number,
    description?: string,
    extendName?: string,
): ExtendObjectJSONSchema {
    const shape = getObjectShape(objectType);
    const properties: Record<string, ExtendJSONSchema> = {};
    const required: string[] = [];

    for (const key of Object.keys(shape)) {
        const value = shape[key] as z.ZodType;
        properties[key] = convertZodType(value, [...path, key], depth);
        required.push(key);
    }

    const result: ExtendObjectJSONSchema = {
        type: "object",
        properties,
        required,
        additionalProperties: false,
    };
        if (description) result.description = description;
        if (extendName) result["extend:name"] = extendName;
    return result;
}
