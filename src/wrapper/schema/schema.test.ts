import { z } from "zod";
import {
    extendSchema,
    extendDate,
    extendCurrency,
    extendSignature,
    isExtendSchema,
    getJsonSchema,
    EXTEND_SCHEMA_MARKER,
    SchemaConversionError,
} from "./index";
import { zodToExtendSchema } from "./zodToExtendSchema";
import { hasExtendType, getExtendType } from "./customTypes";
import { DATE_TYPE_MARKER, CURRENCY_TYPE_MARKER, SIGNATURE_TYPE_MARKER } from "./types";

// ============================================================================
// extendSchema tests
// ============================================================================

describe("extendSchema", () => {
    describe("basic schema creation", () => {
        it("should create a schema wrapper with marker", () => {
            const schema = extendSchema({
                name: z.string().nullable(),
            });

            expect(schema[EXTEND_SCHEMA_MARKER]).toBe(true);
        });

        it("should include the original zod schema", () => {
            const schema = extendSchema({
                name: z.string().nullable(),
                age: z.number().nullable(),
            });

            expect(schema._zodSchema).toBeDefined();
            expect(schema._zodSchema.shape.name).toBeDefined();
            expect(schema._zodSchema.shape.age).toBeDefined();
        });

        it("should generate valid JSON schema", () => {
            const schema = extendSchema({
                name: z.string().nullable(),
            });

            expect(schema.jsonSchema).toEqual({
                type: "object",
                properties: {
                    name: { type: ["string", "null"] },
                },
                required: ["name"],
                additionalProperties: false,
            });
        });
    });

    describe("primitive types", () => {
        it("should convert nullable string", () => {
            const schema = extendSchema({
                field: z.string().nullable(),
            });

            expect(schema.jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
            });
        });

        it("should convert nullable number", () => {
            const schema = extendSchema({
                field: z.number().nullable(),
            });

            expect(schema.jsonSchema.properties.field).toEqual({
                type: ["number", "null"],
            });
        });

        it("should convert nullable integer", () => {
            const schema = extendSchema({
                field: z.number().int().nullable(),
            });

            expect(schema.jsonSchema.properties.field).toEqual({
                type: ["integer", "null"],
            });
        });

        it("should convert nullable boolean", () => {
            const schema = extendSchema({
                field: z.boolean().nullable(),
            });

            expect(schema.jsonSchema.properties.field).toEqual({
                type: ["boolean", "null"],
            });
        });

        it("should include descriptions", () => {
            const schema = extendSchema({
                name: z.string().nullable().describe("The customer name"),
                age: z.number().nullable().describe("Customer age in years"),
            });

            expect(schema.jsonSchema.properties.name).toEqual({
                type: ["string", "null"],
                description: "The customer name",
            });
            expect(schema.jsonSchema.properties.age).toEqual({
                type: ["number", "null"],
                description: "Customer age in years",
            });
        });
    });

    describe("enum types", () => {
        it("should convert enum with null added", () => {
            const schema = extendSchema({
                status: z.enum(["active", "inactive"]),
            });

            expect(schema.jsonSchema.properties.status).toEqual({
                enum: ["active", "inactive", null],
            });
        });

        it("should preserve description on enums", () => {
            const schema = extendSchema({
                status: z.enum(["active", "inactive"]).describe("Account status"),
            });

            expect(schema.jsonSchema.properties.status).toEqual({
                enum: ["active", "inactive", null],
                description: "Account status",
            });
        });
    });

    describe("literal types", () => {
        it("should convert string literal to enum with null", () => {
            const schema = extendSchema({
                type: z.literal("invoice"),
            });

            expect(schema.jsonSchema.properties.type).toEqual({
                enum: ["invoice", null],
            });
        });

        it("should throw for non-string literals", () => {
            expect(() =>
                extendSchema({
                    value: z.literal(42),
                }),
            ).toThrow(SchemaConversionError);
        });
    });

    describe("array types", () => {
        it("should convert array of objects", () => {
            const schema = extendSchema({
                items: z.array(
                    z.object({
                        name: z.string().nullable(),
                        price: z.number().nullable(),
                    }),
                ),
            });

            expect(schema.jsonSchema.properties.items).toEqual({
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: ["string", "null"] },
                        price: { type: ["number", "null"] },
                    },
                    required: ["name", "price"],
                    additionalProperties: false,
                },
            });
        });

        it("should convert array of strings (non-nullable items)", () => {
            const schema = extendSchema({
                tags: z.array(z.string()),
            });

            expect(schema.jsonSchema.properties.tags).toEqual({
                type: "array",
                items: { type: "string" },
            });
        });

        it("should convert array of numbers", () => {
            const schema = extendSchema({
                values: z.array(z.number()),
            });

            expect(schema.jsonSchema.properties.values).toEqual({
                type: "array",
                items: { type: "number" },
            });
        });

        it("should convert array of integers", () => {
            const schema = extendSchema({
                counts: z.array(z.number().int()),
            });

            expect(schema.jsonSchema.properties.counts).toEqual({
                type: "array",
                items: { type: "integer" },
            });
        });

        it("should convert array of booleans", () => {
            const schema = extendSchema({
                flags: z.array(z.boolean()),
            });

            expect(schema.jsonSchema.properties.flags).toEqual({
                type: "array",
                items: { type: "boolean" },
            });
        });

        it("should include description on arrays", () => {
            const schema = extendSchema({
                items: z.array(z.string()).describe("List of items"),
            });

            expect(schema.jsonSchema.properties.items).toEqual({
                type: "array",
                items: { type: "string" },
                description: "List of items",
            });
        });
    });

    describe("nested objects", () => {
        it("should convert nested objects", () => {
            const schema = extendSchema({
                address: z.object({
                    street: z.string().nullable(),
                    city: z.string().nullable(),
                    zip: z.string().nullable(),
                }),
            });

            expect(schema.jsonSchema.properties.address).toEqual({
                type: "object",
                properties: {
                    street: { type: ["string", "null"] },
                    city: { type: ["string", "null"] },
                    zip: { type: ["string", "null"] },
                },
                required: ["street", "city", "zip"],
                additionalProperties: false,
            });
        });

        it("should handle deeply nested objects", () => {
            const schema = extendSchema({
                level1: z.object({
                    level2: z.object({
                        level3: z.object({
                            value: z.string().nullable(),
                        }),
                    }),
                }),
            });

            expect(schema.jsonSchema.properties.level1).toEqual({
                type: "object",
                properties: {
                    level2: {
                        type: "object",
                        properties: {
                            level3: {
                                type: "object",
                                properties: {
                                    value: { type: ["string", "null"] },
                                },
                                required: ["value"],
                                additionalProperties: false,
                            },
                        },
                        required: ["level3"],
                        additionalProperties: false,
                    },
                },
                required: ["level2"],
                additionalProperties: false,
            });
        });
    });

    describe("optional and default wrappers", () => {
        it("should unwrap nullable and preserve the type", () => {
            const schema = extendSchema({
                field: z.string().nullable(),
            });

            expect(schema.jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
            });
        });

        it("should unwrap optional", () => {
            const schema = extendSchema({
                field: z.string().optional(),
            });

            expect(schema.jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
            });
        });

        it("should preserve description through wrappers", () => {
            const schema = extendSchema({
                field: z.string().describe("Description here").nullable(),
            });

            expect(schema.jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
                description: "Description here",
            });
        });

        it("should preserve description on outer wrapper", () => {
            const schema = extendSchema({
                field: z.string().nullable().describe("Description here"),
            });

            expect(schema.jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
                description: "Description here",
            });
        });
    });
});

// ============================================================================
// Custom types tests
// ============================================================================

describe("extendDate", () => {
    it("should create a date schema with marker", () => {
        const dateSchema = extendDate();

        expect(hasExtendType(dateSchema)).toBe(true);
        expect(getExtendType(dateSchema)).toBe(DATE_TYPE_MARKER);
    });

    it("should convert to extend:type date in JSON schema", () => {
        const schema = extendSchema({
            invoice_date: extendDate(),
        });

        expect(schema.jsonSchema.properties.invoice_date).toEqual({
            type: ["string", "null"],
            "extend:type": "date",
        });
    });

    it("should preserve description through .describe()", () => {
        const schema = extendSchema({
            invoice_date: extendDate().describe("The invoice date"),
        });

        expect(schema.jsonSchema.properties.invoice_date).toEqual({
            type: ["string", "null"],
            "extend:type": "date",
            description: "The invoice date",
        });
    });

    it("should preserve marker through .nullable()", () => {
        const dateSchema = extendDate().nullable();
        expect(hasExtendType(dateSchema)).toBe(true);
        expect(getExtendType(dateSchema)).toBe(DATE_TYPE_MARKER);
    });

    it("should preserve marker through .optional()", () => {
        const dateSchema = extendDate().optional();
        expect(hasExtendType(dateSchema)).toBe(true);
        expect(getExtendType(dateSchema)).toBe(DATE_TYPE_MARKER);
    });

    it("should work in arrays with non-nullable format", () => {
        const schema = extendSchema({
            dates: z.array(extendDate()),
        });

        expect(schema.jsonSchema.properties.dates).toEqual({
            type: "array",
            items: { type: "string", "extend:type": "date" },
        });
    });
});

describe("extendCurrency", () => {
    it("should create a currency schema with marker", () => {
        const currencySchema = extendCurrency();

        expect(hasExtendType(currencySchema)).toBe(true);
        expect(getExtendType(currencySchema)).toBe(CURRENCY_TYPE_MARKER);
    });

    it("should convert to extend:type currency in JSON schema", () => {
        const schema = extendSchema({
            total: extendCurrency(),
        });

        expect(schema.jsonSchema.properties.total).toEqual({
            type: "object",
            "extend:type": "currency",
            properties: {
                amount: { type: ["number", "null"] },
                iso_4217_currency_code: { type: ["string", "null"] },
            },
            required: ["amount", "iso_4217_currency_code"],
            additionalProperties: false,
        });
    });

    it("should preserve description", () => {
        const schema = extendSchema({
            total: extendCurrency().describe("Total invoice amount"),
        });

        expect(schema.jsonSchema.properties.total).toEqual({
            type: "object",
            "extend:type": "currency",
            properties: {
                amount: { type: ["number", "null"] },
                iso_4217_currency_code: { type: ["string", "null"] },
            },
            required: ["amount", "iso_4217_currency_code"],
            additionalProperties: false,
            description: "Total invoice amount",
        });
    });

    it("should work in arrays", () => {
        const schema = extendSchema({
            amounts: z.array(extendCurrency()),
        });

        expect(schema.jsonSchema.properties.amounts).toEqual({
            type: "array",
            items: {
                type: "object",
                "extend:type": "currency",
                properties: {
                    amount: { type: ["number", "null"] },
                    iso_4217_currency_code: { type: ["string", "null"] },
                },
                required: ["amount", "iso_4217_currency_code"],
                additionalProperties: false,
            },
        });
    });
});

describe("extendSignature", () => {
    it("should create a signature schema with marker", () => {
        const signatureSchema = extendSignature();

        expect(hasExtendType(signatureSchema)).toBe(true);
        expect(getExtendType(signatureSchema)).toBe(SIGNATURE_TYPE_MARKER);
    });

    it("should convert to extend:type signature in JSON schema", () => {
        const schema = extendSchema({
            customer_signature: extendSignature(),
        });

        expect(schema.jsonSchema.properties.customer_signature).toEqual({
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
        });
    });

    it("should preserve description", () => {
        const schema = extendSchema({
            signature: extendSignature().describe("Customer signature"),
        });

        expect(schema.jsonSchema.properties.signature.description).toBe("Customer signature");
    });

    it("should work in arrays", () => {
        const schema = extendSchema({
            signatures: z.array(extendSignature()),
        });

        expect(schema.jsonSchema.properties.signatures).toEqual({
            type: "array",
            items: {
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
            },
        });
    });
});

// ============================================================================
// isExtendSchema tests
// ============================================================================

describe("isExtendSchema", () => {
    it("should return true for ExtendSchemaWrapper", () => {
        const schema = extendSchema({
            name: z.string().nullable(),
        });

        expect(isExtendSchema(schema)).toBe(true);
    });

    it("should return false for plain object", () => {
        expect(isExtendSchema({ type: "object" })).toBe(false);
    });

    it("should return false for null", () => {
        expect(isExtendSchema(null)).toBe(false);
    });

    it("should return false for undefined", () => {
        expect(isExtendSchema(undefined)).toBe(false);
    });

    it("should return false for zod schema directly", () => {
        const zodSchema = z.object({ name: z.string() });
        expect(isExtendSchema(zodSchema)).toBe(false);
    });
});

// ============================================================================
// getJsonSchema tests
// ============================================================================

describe("getJsonSchema", () => {
    it("should extract JSON schema from wrapper", () => {
        const schema = extendSchema({
            field: z.string().nullable(),
        });

        const jsonSchema = getJsonSchema(schema);

        expect(jsonSchema).toEqual({
            type: "object",
            properties: {
                field: { type: ["string", "null"] },
            },
            required: ["field"],
            additionalProperties: false,
        });
    });
});

// ============================================================================
// Error handling tests
// ============================================================================

describe("SchemaConversionError", () => {
    it("should include path in error message", () => {
        const error = new SchemaConversionError("Unsupported type", ["items", "nested", "field"]);

        expect(error.message).toBe("Unsupported type at path: items.nested.field");
        expect(error.path).toEqual(["items", "nested", "field"]);
    });

    it("should work without path", () => {
        const error = new SchemaConversionError("General error");

        expect(error.message).toBe("General error");
        expect(error.path).toEqual([]);
    });

    it("should have correct name", () => {
        const error = new SchemaConversionError("test");
        expect(error.name).toBe("SchemaConversionError");
    });
});

describe("unsupported types", () => {
    it("should throw for unsupported zod types", () => {
        // z.undefined() is not supported
        expect(() =>
            extendSchema({
                field: z.undefined() as unknown as z.ZodType,
            }),
        ).toThrow(SchemaConversionError);
    });

    it("should throw for array of enums", () => {
        expect(() =>
            extendSchema({
                statuses: z.array(z.enum(["a", "b"])),
            }),
        ).toThrow(SchemaConversionError);
    });

    it("should throw for array of literals", () => {
        expect(() =>
            extendSchema({
                values: z.array(z.literal("test")),
            }),
        ).toThrow(SchemaConversionError);
    });
});

// ============================================================================
// Complex schema tests
// ============================================================================

describe("complex schemas", () => {
    it("should convert a realistic invoice schema", () => {
        const InvoiceSchema = extendSchema({
            invoice_number: z.string().nullable().describe("The invoice number"),
            invoice_date: extendDate().describe("The invoice date"),
            due_date: extendDate().describe("Payment due date"),
            vendor: z
                .object({
                    name: z.string().nullable().describe("Vendor company name"),
                    address: z.string().nullable().describe("Vendor address"),
                })
                .describe("Vendor information"),
            total_amount: extendCurrency().describe("Total invoice amount"),
            line_items: z
                .array(
                    z.object({
                        description: z.string().nullable(),
                        quantity: z.number().nullable(),
                        unit_price: extendCurrency(),
                        line_total: extendCurrency(),
                    }),
                )
                .describe("Invoice line items"),
            status: z.enum(["draft", "sent", "paid", "overdue"]).describe("Invoice status"),
        });

        expect(InvoiceSchema.jsonSchema.type).toBe("object");
        expect(InvoiceSchema.jsonSchema.required).toContain("invoice_number");
        expect(InvoiceSchema.jsonSchema.required).toContain("invoice_date");
        expect(InvoiceSchema.jsonSchema.required).toContain("line_items");

        // Verify custom types
        expect((InvoiceSchema.jsonSchema.properties.invoice_date as Record<string, unknown>)["extend:type"]).toBe(
            "date",
        );
        expect((InvoiceSchema.jsonSchema.properties.total_amount as Record<string, unknown>)["extend:type"]).toBe(
            "currency",
        );

        // Verify array items have currency types
        const lineItemsSchema = InvoiceSchema.jsonSchema.properties.line_items as {
            items: { properties: Record<string, unknown> };
        };
        expect(lineItemsSchema.items.properties.unit_price).toHaveProperty("extend:type", "currency");
    });

    it("should convert a contract schema with signatures", () => {
        const ContractSchema = extendSchema({
            contract_id: z.string().nullable(),
            effective_date: extendDate(),
            party_a_signature: extendSignature().describe("Party A signature"),
            party_b_signature: extendSignature().describe("Party B signature"),
            terms: z.array(
                z.object({
                    section: z.string().nullable(),
                    content: z.string().nullable(),
                }),
            ),
        });

        expect((ContractSchema.jsonSchema.properties.party_a_signature as Record<string, unknown>)["extend:type"]).toBe(
            "signature",
        );
        expect((ContractSchema.jsonSchema.properties.party_b_signature as Record<string, unknown>)["extend:type"]).toBe(
            "signature",
        );
    });
});

// ============================================================================
// zodToExtendSchema direct tests
// ============================================================================

describe("zodToExtendSchema", () => {
    it("should set additionalProperties to false at root level", () => {
        const zodSchema = z.object({
            name: z.string().nullable(),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.additionalProperties).toBe(false);
    });

    it("should add all properties to required array", () => {
        const zodSchema = z.object({
            field1: z.string().nullable(),
            field2: z.number().nullable(),
            field3: z.boolean().nullable(),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.required).toEqual(["field1", "field2", "field3"]);
    });
});
