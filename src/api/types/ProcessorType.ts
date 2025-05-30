/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * The type of processor:
 * * `"EXTRACT"` - Extracts structured data from documents
 * * `"CLASSIFY"` - Classifies documents into categories
 * * `"SPLITTER"` - Splits documents into multiple parts
 */
export type ProcessorType = "EXTRACT" | "CLASSIFY" | "SPLITTER";
export const ProcessorType = {
    Extract: "EXTRACT",
    Classify: "CLASSIFY",
    Splitter: "SPLITTER",
} as const;
