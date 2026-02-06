import { z } from "zod";
import {
    extendDate,
    extendCurrency,
    extendSignature,
    SchemaConversionError,
} from "./index";
import { zodToExtendSchema } from "./zodToExtendSchema";
import { hasExtendType, getExtendType } from "./customTypes";
import { DATE_TYPE_MARKER, CURRENCY_TYPE_MARKER, SIGNATURE_TYPE_MARKER } from "./types";

// ============================================================================
// zodToExtendSchema tests
// ============================================================================

describe("zodToExtendSchema", () => {
    describe("basic schema creation", () => {
        it("should generate valid JSON schema from zod object", () => {
            const zodSchema = z.object({
                name: z.string().nullable(),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema).toEqual({
                type: "object",
                properties: {
                    name: { type: ["string", "null"] },
                },
                required: ["name"],
                additionalProperties: false,
            });
        });

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

    describe("primitive types", () => {
        it("should convert nullable string", () => {
            const zodSchema = z.object({
                field: z.string().nullable(),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
            });
        });

        it("should convert nullable number", () => {
            const zodSchema = z.object({
                field: z.number().nullable(),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.field).toEqual({
                type: ["number", "null"],
            });
        });

        it("should convert nullable integer", () => {
            const zodSchema = z.object({
                field: z.number().int().nullable(),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.field).toEqual({
                type: ["integer", "null"],
            });
        });

        it("should convert nullable boolean", () => {
            const zodSchema = z.object({
                field: z.boolean().nullable(),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.field).toEqual({
                type: ["boolean", "null"],
            });
        });

        it("should include descriptions", () => {
            const zodSchema = z.object({
                name: z.string().nullable().describe("The customer name"),
                age: z.number().nullable().describe("Customer age in years"),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.name).toEqual({
                type: ["string", "null"],
                description: "The customer name",
            });
            expect(jsonSchema.properties.age).toEqual({
                type: ["number", "null"],
                description: "Customer age in years",
            });
        });
    });

    describe("enum types", () => {
        it("should convert enum with null added", () => {
            const zodSchema = z.object({
                status: z.enum(["active", "inactive"]),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.status).toEqual({
                enum: ["active", "inactive", null],
            });
        });

        it("should preserve description on enums", () => {
            const zodSchema = z.object({
                status: z.enum(["active", "inactive"]).describe("Account status"),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.status).toEqual({
                enum: ["active", "inactive", null],
                description: "Account status",
            });
        });
    });

    describe("literal types", () => {
        it("should convert string literal to enum with null", () => {
            const zodSchema = z.object({
                type: z.literal("invoice"),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.type).toEqual({
                enum: ["invoice", null],
            });
        });

        it("should throw for non-string literals", () => {
            expect(() =>
                zodToExtendSchema(z.object({
                    value: z.literal(42),
                })),
            ).toThrow(SchemaConversionError);
        });
    });

    describe("array types", () => {
        it("should convert array of objects", () => {
            const zodSchema = z.object({
                items: z.array(
                    z.object({
                        name: z.string().nullable(),
                        price: z.number().nullable(),
                    }),
                ),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.items).toEqual({
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
            const zodSchema = z.object({
                tags: z.array(z.string()),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.tags).toEqual({
                type: "array",
                items: { type: "string" },
            });
        });

        it("should convert array of numbers", () => {
            const zodSchema = z.object({
                values: z.array(z.number()),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.values).toEqual({
                type: "array",
                items: { type: "number" },
            });
        });

        it("should convert array of integers", () => {
            const zodSchema = z.object({
                counts: z.array(z.number().int()),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.counts).toEqual({
                type: "array",
                items: { type: "integer" },
            });
        });

        it("should convert array of booleans", () => {
            const zodSchema = z.object({
                flags: z.array(z.boolean()),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.flags).toEqual({
                type: "array",
                items: { type: "boolean" },
            });
        });

        it("should include description on arrays", () => {
            const zodSchema = z.object({
                items: z.array(z.string()).describe("List of items"),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.items).toEqual({
                type: "array",
                items: { type: "string" },
                description: "List of items",
            });
        });
    });

    describe("nested objects", () => {
        it("should convert nested objects", () => {
            const zodSchema = z.object({
                address: z.object({
                    street: z.string().nullable(),
                    city: z.string().nullable(),
                    zip: z.string().nullable(),
                }),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.address).toEqual({
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
            const zodSchema = z.object({
                level1: z.object({
                    level2: z.object({
                        level3: z.object({
                            value: z.string().nullable(),
                        }),
                    }),
                }),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.level1).toEqual({
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
            const zodSchema = z.object({
                field: z.string().nullable(),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
            });
        });

        it("should unwrap optional", () => {
            const zodSchema = z.object({
                field: z.string().optional(),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
            });
        });

        it("should preserve description through wrappers", () => {
            const zodSchema = z.object({
                field: z.string().describe("Description here").nullable(),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.field).toEqual({
                type: ["string", "null"],
                description: "Description here",
            });
        });

        it("should preserve description on outer wrapper", () => {
            const zodSchema = z.object({
                field: z.string().nullable().describe("Description here"),
            });

            const jsonSchema = zodToExtendSchema(zodSchema);

            expect(jsonSchema.properties.field).toEqual({
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
        const zodSchema = z.object({
            invoice_date: extendDate(),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.invoice_date).toEqual({
            type: ["string", "null"],
            "extend:type": "date",
        });
    });

    it("should preserve description through .describe()", () => {
        const zodSchema = z.object({
            invoice_date: extendDate().describe("The invoice date"),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.invoice_date).toEqual({
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
        const zodSchema = z.object({
            dates: z.array(extendDate()),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.dates).toEqual({
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
        const zodSchema = z.object({
            total: extendCurrency(),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.total).toEqual({
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
        const zodSchema = z.object({
            total: extendCurrency().describe("Total invoice amount"),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.total).toEqual({
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
        const zodSchema = z.object({
            amounts: z.array(extendCurrency()),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.amounts).toEqual({
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
        const zodSchema = z.object({
            customer_signature: extendSignature(),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.customer_signature).toEqual({
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
        const zodSchema = z.object({
            signature: extendSignature().describe("Customer signature"),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.signature.description).toBe("Customer signature");
    });

    it("should work in arrays", () => {
        const zodSchema = z.object({
            signatures: z.array(extendSignature()),
        });

        const jsonSchema = zodToExtendSchema(zodSchema);

        expect(jsonSchema.properties.signatures).toEqual({
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
            zodToExtendSchema(z.object({
                field: z.undefined() as unknown as z.ZodType,
            })),
        ).toThrow(SchemaConversionError);
    });

    it("should throw for array of enums", () => {
        expect(() =>
            zodToExtendSchema(z.object({
                statuses: z.array(z.enum(["a", "b"])),
            })),
        ).toThrow(SchemaConversionError);
    });

    it("should throw for array of literals", () => {
        expect(() =>
            zodToExtendSchema(z.object({
                values: z.array(z.literal("test")),
            })),
        ).toThrow(SchemaConversionError);
    });
});

// ============================================================================
// Complex schema tests
// ============================================================================

describe("complex schemas", () => {
    it("should convert a realistic invoice schema", () => {
        const InvoiceSchema = z.object({
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

        const jsonSchema = zodToExtendSchema(InvoiceSchema);

        expect(jsonSchema.type).toBe("object");
        expect(jsonSchema.required).toContain("invoice_number");
        expect(jsonSchema.required).toContain("invoice_date");
        expect(jsonSchema.required).toContain("line_items");

        // Verify custom types
        expect((jsonSchema.properties.invoice_date as Record<string, unknown>)["extend:type"]).toBe(
            "date",
        );
        expect((jsonSchema.properties.total_amount as Record<string, unknown>)["extend:type"]).toBe(
            "currency",
        );

        // Verify array items have currency types
        const lineItemsSchema = jsonSchema.properties.line_items as {
            items: { properties: Record<string, unknown> };
        };
        expect(lineItemsSchema.items.properties.unit_price).toHaveProperty("extend:type", "currency");
    });

    it("should convert a contract schema with signatures", () => {
        const ContractSchema = z.object({
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

        const jsonSchema = zodToExtendSchema(ContractSchema);

        expect((jsonSchema.properties.party_a_signature as Record<string, unknown>)["extend:type"]).toBe(
            "signature",
        );
        expect((jsonSchema.properties.party_b_signature as Record<string, unknown>)["extend:type"]).toBe(
            "signature",
        );
    });
});
