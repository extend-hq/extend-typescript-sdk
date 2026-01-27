import { z } from "zod";
import { zodToExtendSchema, SchemaConversionError } from "../../../src/wrapper/schema/zodToExtendSchema";
import { extendDate, extendCurrency, extendSignature } from "../../../src/wrapper/schema/customTypes";

describe("zodToExtendSchema", () => {
    describe("primitive types", () => {
        it("should convert z.string() to nullable string type", () => {
            const schema = z.object({
                name: z.string(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({
                type: ["string", "null"],
            });
        });

        it("should convert z.number() to nullable number type", () => {
            const schema = z.object({
                amount: z.number(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.amount).toEqual({
                type: ["number", "null"],
            });
        });

        it("should convert z.number().int() to nullable integer type", () => {
            const schema = z.object({
                count: z.number().int(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.count).toEqual({
                type: ["integer", "null"],
            });
        });

        it("should convert z.boolean() to nullable boolean type", () => {
            const schema = z.object({
                active: z.boolean(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.active).toEqual({
                type: ["boolean", "null"],
            });
        });

        it("should handle multiple primitive fields", () => {
            const schema = z.object({
                name: z.string(),
                age: z.number().int(),
                score: z.number(),
                verified: z.boolean(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({ type: ["string", "null"] });
            expect(result.properties.age).toEqual({ type: ["integer", "null"] });
            expect(result.properties.score).toEqual({ type: ["number", "null"] });
            expect(result.properties.verified).toEqual({ type: ["boolean", "null"] });
        });
    });

    describe("enum types", () => {
        it("should convert z.enum() to enum with null", () => {
            const schema = z.object({
                status: z.enum(["pending", "approved", "rejected"]),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.status).toEqual({
                enum: ["pending", "approved", "rejected", null],
            });
        });

        it("should not duplicate null if already present in enum", () => {
            // Note: z.enum doesn't support null directly, but our conversion adds it
            const schema = z.object({
                status: z.enum(["active", "inactive"]),
            });
            const result = zodToExtendSchema(schema);
            const enumValues = (result.properties.status as { enum: (string | null)[] }).enum;

            // Should have exactly one null
            expect(enumValues.filter((v) => v === null).length).toBe(1);
        });

        it("should convert z.literal() string to enum with null", () => {
            const schema = z.object({
                type: z.literal("invoice"),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.type).toEqual({
                enum: ["invoice", null],
            });
        });

        it("should handle single value enum", () => {
            const schema = z.object({
                status: z.enum(["only_option"]),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.status).toEqual({
                enum: ["only_option", null],
            });
        });
    });

    describe("object types", () => {
        it("should convert simple flat object", () => {
            const schema = z.object({
                name: z.string(),
                value: z.number(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.type).toBe("object");
            expect(result.additionalProperties).toBe(false);
            expect(result.required).toEqual(["name", "value"]);
            expect(Object.keys(result.properties)).toEqual(["name", "value"]);
        });

        it("should convert nested objects", () => {
            const schema = z.object({
                user: z.object({
                    name: z.string(),
                    email: z.string(),
                }),
            });
            const result = zodToExtendSchema(schema);

            const userProp = result.properties.user as {
                type: string;
                properties: Record<string, unknown>;
                required: string[];
                additionalProperties: boolean;
            };

            expect(userProp.type).toBe("object");
            expect(userProp.additionalProperties).toBe(false);
            expect(userProp.required).toEqual(["name", "email"]);
            expect(userProp.properties.name).toEqual({ type: ["string", "null"] });
            expect(userProp.properties.email).toEqual({ type: ["string", "null"] });
        });

        it("should set additionalProperties to false on all objects", () => {
            const schema = z.object({
                outer: z.object({
                    inner: z.object({
                        value: z.string(),
                    }),
                }),
            });
            const result = zodToExtendSchema(schema);

            expect(result.additionalProperties).toBe(false);
            expect((result.properties.outer as { additionalProperties: boolean }).additionalProperties).toBe(false);

            const outerProps = (result.properties.outer as { properties: Record<string, unknown> }).properties;
            expect((outerProps.inner as { additionalProperties: boolean }).additionalProperties).toBe(false);
        });

        it("should include all property keys in required array", () => {
            const schema = z.object({
                field1: z.string(),
                field2: z.number(),
                field3: z.boolean(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.required).toEqual(["field1", "field2", "field3"]);
        });

        it("should handle deeply nested objects", () => {
            const schema = z.object({
                level1: z.object({
                    level2: z.object({
                        level3: z.object({
                            value: z.string(),
                        }),
                    }),
                }),
            });
            const result = zodToExtendSchema(schema);

            const level1 = result.properties.level1 as { properties: Record<string, unknown> };
            const level2 = level1.properties.level2 as { properties: Record<string, unknown> };
            const level3 = level2.properties.level3 as { properties: Record<string, unknown> };

            expect(level3.properties.value).toEqual({ type: ["string", "null"] });
        });
    });

    describe("array types", () => {
        it("should convert array of strings with non-nullable items", () => {
            const schema = z.object({
                tags: z.array(z.string()),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.tags).toEqual({
                type: "array",
                items: { type: "string" },
            });
        });

        it("should convert array of numbers with non-nullable items", () => {
            const schema = z.object({
                scores: z.array(z.number()),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.scores).toEqual({
                type: "array",
                items: { type: "number" },
            });
        });

        it("should convert array of integers with non-nullable items", () => {
            const schema = z.object({
                quantities: z.array(z.number().int()),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.quantities).toEqual({
                type: "array",
                items: { type: "integer" },
            });
        });

        it("should convert array of booleans with non-nullable items", () => {
            const schema = z.object({
                flags: z.array(z.boolean()),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.flags).toEqual({
                type: "array",
                items: { type: "boolean" },
            });
        });

        it("should convert array of objects", () => {
            const schema = z.object({
                items: z.array(
                    z.object({
                        name: z.string(),
                        price: z.number(),
                    }),
                ),
            });
            const result = zodToExtendSchema(schema);

            const arrayProp = result.properties.items as {
                type: string;
                items: {
                    type: string;
                    properties: Record<string, unknown>;
                    required: string[];
                    additionalProperties: boolean;
                };
            };

            expect(arrayProp.type).toBe("array");
            expect(arrayProp.items.type).toBe("object");
            expect(arrayProp.items.additionalProperties).toBe(false);
            expect(arrayProp.items.properties.name).toEqual({ type: ["string", "null"] });
            expect(arrayProp.items.properties.price).toEqual({ type: ["number", "null"] });
        });

        it("should handle nested arrays", () => {
            const schema = z.object({
                matrix: z.array(
                    z.object({
                        values: z.array(z.number()),
                    }),
                ),
            });
            const result = zodToExtendSchema(schema);

            const matrixProp = result.properties.matrix as unknown as {
                type: string;
                items: {
                    properties: {
                        values: { type: string; items: { type: string } };
                    };
                };
            };

            expect(matrixProp.items.properties.values).toEqual({
                type: "array",
                items: { type: "number" },
            });
        });
    });

    describe("custom extend types", () => {
        describe("extendDate", () => {
            it("should convert extendDate() to date type at top level", () => {
                const schema = z.object({
                    invoice_date: extendDate(),
                });
                const result = zodToExtendSchema(schema);

                expect(result.properties.invoice_date).toEqual({
                    type: ["string", "null"],
                    "extend:type": "date",
                });
            });

            it("should convert extendDate() in arrays", () => {
                const schema = z.object({
                    dates: z.array(extendDate()),
                });
                const result = zodToExtendSchema(schema);

                expect(result.properties.dates).toEqual({
                    type: "array",
                    items: { type: "string", "extend:type": "date" },
                });
            });
        });

        describe("extendCurrency", () => {
            it("should convert extendCurrency() with proper structure", () => {
                const schema = z.object({
                    total: extendCurrency(),
                });
                const result = zodToExtendSchema(schema);

                const currencyProp = result.properties.total as {
                    type: string;
                    "extend:type": string;
                    properties: Record<string, unknown>;
                    required: string[];
                    additionalProperties: boolean;
                };

                expect(currencyProp.type).toBe("object");
                expect(currencyProp["extend:type"]).toBe("currency");
                expect(currencyProp.additionalProperties).toBe(false);
                expect(currencyProp.properties.amount).toEqual({ type: ["number", "null"] });
                expect(currencyProp.properties.iso_4217_currency_code).toEqual({ type: ["string", "null"] });
                expect(currencyProp.required).toEqual(["amount", "iso_4217_currency_code"]);
            });

            it("should convert extendCurrency() in arrays", () => {
                const schema = z.object({
                    prices: z.array(extendCurrency()),
                });
                const result = zodToExtendSchema(schema);

                const arrayProp = result.properties.prices as {
                    type: string;
                    items: {
                        type: string;
                        "extend:type": string;
                        properties: Record<string, unknown>;
                        required: string[];
                        additionalProperties: boolean;
                    };
                };

                expect(arrayProp.type).toBe("array");
                expect(arrayProp.items["extend:type"]).toBe("currency");
                expect(arrayProp.items.additionalProperties).toBe(false);
            });
        });

        describe("extendSignature", () => {
            it("should convert extendSignature() with all required fields", () => {
                const schema = z.object({
                    customer_signature: extendSignature(),
                });
                const result = zodToExtendSchema(schema);

                const signatureProp = result.properties.customer_signature as {
                    type: string;
                    "extend:type": string;
                    properties: Record<string, unknown>;
                    required: string[];
                    additionalProperties: boolean;
                };

                expect(signatureProp.type).toBe("object");
                expect(signatureProp["extend:type"]).toBe("signature");
                expect(signatureProp.additionalProperties).toBe(false);
                expect(signatureProp.required).toEqual([
                    "printed_name",
                    "signature_date",
                    "is_signed",
                    "title_or_role",
                ]);

                expect(signatureProp.properties.printed_name).toEqual({ type: ["string", "null"] });
                expect(signatureProp.properties.signature_date).toEqual({
                    type: ["string", "null"],
                    "extend:type": "date",
                });
                expect(signatureProp.properties.is_signed).toEqual({ type: ["boolean", "null"] });
                expect(signatureProp.properties.title_or_role).toEqual({ type: ["string", "null"] });
            });

            it("should convert extendSignature() in arrays", () => {
                const schema = z.object({
                    signatures: z.array(extendSignature()),
                });
                const result = zodToExtendSchema(schema);

                const arrayProp = result.properties.signatures as {
                    type: string;
                    items: {
                        type: string;
                        "extend:type": string;
                        additionalProperties: boolean;
                    };
                };

                expect(arrayProp.type).toBe("array");
                expect(arrayProp.items["extend:type"]).toBe("signature");
                expect(arrayProp.items.additionalProperties).toBe(false);
            });
        });
    });

    describe("wrapper types", () => {
        it("should handle z.string().nullable()", () => {
            const schema = z.object({
                name: z.string().nullable(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({
                type: ["string", "null"],
            });
        });

        it("should handle z.string().optional()", () => {
            const schema = z.object({
                name: z.string().optional(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({
                type: ["string", "null"],
            });
        });

        it("should handle z.string().default()", () => {
            const schema = z.object({
                name: z.string().default("default_value"),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({
                type: ["string", "null"],
            });
        });

        it("should handle nested wrappers: nullable().optional()", () => {
            const schema = z.object({
                name: z.string().nullable().optional(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({
                type: ["string", "null"],
            });
        });

        it("should handle optional().nullable()", () => {
            const schema = z.object({
                name: z.string().optional().nullable(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({
                type: ["string", "null"],
            });
        });

        it("should handle wrappers on number types", () => {
            const schema = z.object({
                count: z.number().int().nullable(),
                amount: z.number().optional(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.count).toEqual({ type: ["integer", "null"] });
            expect(result.properties.amount).toEqual({ type: ["number", "null"] });
        });

        it("should handle wrappers on custom types", () => {
            const schema = z.object({
                // extendDate() already returns nullable, but wrapping should work
                date: extendDate(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.date).toEqual({
                type: ["string", "null"],
                "extend:type": "date",
            });
        });

        it("should preserve extend type when chaining .describe() on custom types", () => {
            const schema = z.object({
                date: extendDate().describe("A date field"),
                currency: extendCurrency().describe("A currency field"),
                signature: extendSignature().describe("A signature field"),
            });
            const result = zodToExtendSchema(schema);

            expect((result.properties.date as { "extend:type": string })["extend:type"]).toBe("date");
            expect((result.properties.date as { description: string }).description).toBe("A date field");

            expect((result.properties.currency as { "extend:type": string })["extend:type"]).toBe("currency");
            expect((result.properties.currency as { description: string }).description).toBe("A currency field");

            expect((result.properties.signature as { "extend:type": string })["extend:type"]).toBe("signature");
            expect((result.properties.signature as { description: string }).description).toBe("A signature field");
        });

        it("should preserve extend type when chaining .optional() on custom types", () => {
            const schema = z.object({
                date: extendDate().optional(),
            });
            const result = zodToExtendSchema(schema);

            expect((result.properties.date as { "extend:type": string })["extend:type"]).toBe("date");
        });

        it("should preserve extend type when chaining multiple methods", () => {
            const schema = z.object({
                date: extendDate().describe("Description").optional(),
            });
            const result = zodToExtendSchema(schema);

            expect((result.properties.date as { "extend:type": string })["extend:type"]).toBe("date");
            expect((result.properties.date as { description: string }).description).toBe("Description");
        });
    });

    describe("descriptions", () => {
        it("should include description when provided on string field", () => {
            const schema = z.object({
                name: z.string().describe("The customer name"),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({
                type: ["string", "null"],
                description: "The customer name",
            });
        });

        it("should include description when provided on number field", () => {
            const schema = z.object({
                amount: z.number().describe("The total amount"),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.amount).toEqual({
                type: ["number", "null"],
                description: "The total amount",
            });
        });

        it("should include description on enum field", () => {
            const schema = z.object({
                status: z.enum(["active", "inactive"]).describe("Current status"),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.status).toEqual({
                enum: ["active", "inactive", null],
                description: "Current status",
            });
        });

        it("should include description on array field", () => {
            const schema = z.object({
                tags: z.array(z.string()).describe("List of tags"),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.tags).toEqual({
                type: "array",
                items: { type: "string" },
                description: "List of tags",
            });
        });

        it("should include description on nested object", () => {
            const schema = z.object({
                address: z
                    .object({
                        street: z.string(),
                        city: z.string(),
                    })
                    .describe("Shipping address"),
            });
            const result = zodToExtendSchema(schema);

            const addressProp = result.properties.address as {
                type: string;
                description: string;
            };

            expect(addressProp.description).toBe("Shipping address");
        });

        it("should include description on custom extend types", () => {
            const schema = z.object({
                invoice_date: extendDate().describe("The invoice date"),
                total: extendCurrency().describe("Total amount"),
            });
            const result = zodToExtendSchema(schema);

            // Verify the extend types AND descriptions are both preserved
            expect(result.properties.invoice_date).toEqual({
                type: ["string", "null"],
                "extend:type": "date",
                description: "The invoice date",
            });

            const totalProp = result.properties.total as {
                type: string;
                "extend:type": string;
                description: string;
            };
            expect(totalProp["extend:type"]).toBe("currency");
            expect(totalProp.description).toBe("Total amount");
        });

        it("should not include description property when not provided", () => {
            const schema = z.object({
                name: z.string(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.properties.name).toEqual({
                type: ["string", "null"],
            });
            expect("description" in result.properties.name).toBe(false);
        });
    });

    describe("error handling", () => {
        it("should throw SchemaConversionError for unsupported Zod union type", () => {
            const schema = z.object({
                value: z.union([z.string(), z.number()]),
            });

            expect(() => zodToExtendSchema(schema)).toThrow(SchemaConversionError);
        });

        it("should throw SchemaConversionError for non-string literal", () => {
            const schema = z.object({
                count: z.literal(123),
            });

            expect(() => zodToExtendSchema(schema)).toThrow(SchemaConversionError);
            expect(() => zodToExtendSchema(schema)).toThrow("Unsupported literal type: number");
        });

        it("should throw SchemaConversionError for unsupported array item type", () => {
            const schema = z.object({
                items: z.array(z.union([z.string(), z.number()])),
            });

            expect(() => zodToExtendSchema(schema)).toThrow(SchemaConversionError);
        });

        it("should include path information in error", () => {
            const schema = z.object({
                nested: z.object({
                    bad: z.union([z.string(), z.number()]),
                }),
            });

            try {
                zodToExtendSchema(schema);
                fail("Expected SchemaConversionError to be thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(SchemaConversionError);
                expect((error as SchemaConversionError).path).toEqual(["nested", "bad"]);
                expect((error as SchemaConversionError).message).toContain("nested.bad");
            }
        });

        it("should throw for z.intersection()", () => {
            const schema = z.object({
                value: z.intersection(z.object({ a: z.string() }), z.object({ b: z.number() })),
            });

            expect(() => zodToExtendSchema(schema)).toThrow(SchemaConversionError);
        });

        it("should throw for boolean literal", () => {
            const schema = z.object({
                flag: z.literal(true),
            });

            expect(() => zodToExtendSchema(schema)).toThrow(SchemaConversionError);
            expect(() => zodToExtendSchema(schema)).toThrow("Unsupported literal type: boolean");
        });
    });

    describe("complex real-world schemas", () => {
        it("should convert a realistic invoice schema", () => {
            const InvoiceSchema = z.object({
                invoice_number: z.string().describe("Unique invoice identifier"),
                invoice_date: extendDate().describe("Date of the invoice"),
                due_date: extendDate().describe("Payment due date"),
                vendor: z
                    .object({
                        name: z.string().describe("Vendor name"),
                        address: z.string().describe("Vendor address"),
                    })
                    .describe("Vendor information"),
                total_amount: extendCurrency().describe("Total invoice amount"),
                line_items: z
                    .array(
                        z.object({
                            description: z.string().describe("Item description"),
                            quantity: z.number().int().describe("Quantity"),
                            unit_price: extendCurrency().describe("Price per unit"),
                        }),
                    )
                    .describe("Invoice line items"),
                status: z.enum(["draft", "sent", "paid", "overdue"]).describe("Invoice status"),
            });

            const result = zodToExtendSchema(InvoiceSchema);

            // Root structure
            expect(result.type).toBe("object");
            expect(result.additionalProperties).toBe(false);
            expect(result.required).toEqual([
                "invoice_number",
                "invoice_date",
                "due_date",
                "vendor",
                "total_amount",
                "line_items",
                "status",
            ]);

            // Invoice number
            expect(result.properties.invoice_number).toEqual({
                type: ["string", "null"],
                description: "Unique invoice identifier",
            });

            // Date fields - now with description preserved!
            expect(result.properties.invoice_date).toEqual({
                type: ["string", "null"],
                "extend:type": "date",
                description: "Date of the invoice",
            });

            // Total amount (currency) - now with description preserved!
            const totalAmount = result.properties.total_amount as {
                "extend:type": string;
                description: string;
            };
            expect(totalAmount["extend:type"]).toBe("currency");
            expect(totalAmount.description).toBe("Total invoice amount");

            // Line items array
            const lineItems = result.properties.line_items as {
                type: string;
                items: {
                    properties: Record<string, unknown>;
                };
                description: string;
            };
            expect(lineItems.type).toBe("array");
            expect(lineItems.description).toBe("Invoice line items");

            // Status enum
            expect(result.properties.status).toEqual({
                enum: ["draft", "sent", "paid", "overdue", null],
                description: "Invoice status",
            });
        });

        it("should convert a contract schema with signatures", () => {
            const ContractSchema = z.object({
                contract_id: z.string().describe("Contract identifier"),
                effective_date: extendDate().describe("When the contract becomes effective"),
                parties: z
                    .array(
                        z.object({
                            name: z.string().describe("Party name"),
                            role: z.enum(["buyer", "seller", "guarantor"]).describe("Party role"),
                            signature: extendSignature().describe("Party signature"),
                        }),
                    )
                    .describe("Contract parties"),
                total_value: extendCurrency().describe("Total contract value"),
                is_executed: z.boolean().describe("Whether contract is fully executed"),
            });

            const result = zodToExtendSchema(ContractSchema);

            expect(result.type).toBe("object");

            // Verify effective_date has both extend:type and description
            expect(result.properties.effective_date).toEqual({
                type: ["string", "null"],
                "extend:type": "date",
                description: "When the contract becomes effective",
            });

            // Check parties array structure
            const parties = result.properties.parties as {
                type: string;
                items: {
                    type: string;
                    properties: {
                        signature: {
                            "extend:type": string;
                            description: string;
                            properties: Record<string, unknown>;
                        };
                    };
                };
            };

            expect(parties.type).toBe("array");
            expect(parties.items.properties.signature["extend:type"]).toBe("signature");
            expect(parties.items.properties.signature.description).toBe("Party signature");
        });

        it("should handle schema with all primitive types", () => {
            const schema = z.object({
                string_field: z.string(),
                number_field: z.number(),
                integer_field: z.number().int(),
                boolean_field: z.boolean(),
                enum_field: z.enum(["a", "b"]),
                literal_field: z.literal("constant"),
            });

            const result = zodToExtendSchema(schema);

            expect(result.properties.string_field).toEqual({ type: ["string", "null"] });
            expect(result.properties.number_field).toEqual({ type: ["number", "null"] });
            expect(result.properties.integer_field).toEqual({ type: ["integer", "null"] });
            expect(result.properties.boolean_field).toEqual({ type: ["boolean", "null"] });
            expect(result.properties.enum_field).toEqual({ enum: ["a", "b", null] });
            expect(result.properties.literal_field).toEqual({ enum: ["constant", null] });
        });

        it("should handle schema with all custom types", () => {
            const schema = z.object({
                date: extendDate(),
                currency: extendCurrency(),
                signature: extendSignature(),
            });

            const result = zodToExtendSchema(schema);

            expect((result.properties.date as { "extend:type": string })["extend:type"]).toBe("date");
            expect((result.properties.currency as { "extend:type": string })["extend:type"]).toBe("currency");
            expect((result.properties.signature as { "extend:type": string })["extend:type"]).toBe("signature");
        });

        it("should handle schema with mixed arrays", () => {
            const schema = z.object({
                string_array: z.array(z.string()),
                number_array: z.array(z.number()),
                object_array: z.array(z.object({ id: z.string() })),
                date_array: z.array(extendDate()),
                currency_array: z.array(extendCurrency()),
            });

            const result = zodToExtendSchema(schema);

            expect((result.properties.string_array as { items: { type: string } }).items.type).toBe("string");
            expect((result.properties.number_array as { items: { type: string } }).items.type).toBe("number");
            expect((result.properties.object_array as { items: { type: string } }).items.type).toBe("object");
            expect((result.properties.date_array as { items: { "extend:type": string } }).items["extend:type"]).toBe(
                "date",
            );
            expect(
                (result.properties.currency_array as { items: { "extend:type": string } }).items["extend:type"],
            ).toBe("currency");
        });
    });

    describe("root schema structure", () => {
        it("should always return type object", () => {
            const schema = z.object({ field: z.string() });
            const result = zodToExtendSchema(schema);

            expect(result.type).toBe("object");
        });

        it("should always include additionalProperties: false", () => {
            const schema = z.object({ field: z.string() });
            const result = zodToExtendSchema(schema);

            expect(result.additionalProperties).toBe(false);
        });

        it("should have required array matching property keys exactly", () => {
            const schema = z.object({
                alpha: z.string(),
                beta: z.number(),
                gamma: z.boolean(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.required).toEqual(Object.keys(result.properties));
        });

        it("should preserve property order", () => {
            const schema = z.object({
                first: z.string(),
                second: z.number(),
                third: z.boolean(),
            });
            const result = zodToExtendSchema(schema);

            expect(Object.keys(result.properties)).toEqual(["first", "second", "third"]);
            expect(result.required).toEqual(["first", "second", "third"]);
        });

        it("should handle single property schema", () => {
            const schema = z.object({
                only: z.string(),
            });
            const result = zodToExtendSchema(schema);

            expect(result.type).toBe("object");
            expect(result.required).toEqual(["only"]);
            expect(Object.keys(result.properties).length).toBe(1);
        });
    });
});
