/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * A record of edits made to the processor output.
 */
export interface ExtractionOutputEdits {
    originalValue?: unknown;
    editedValue?: unknown;
    /** Any notes added during editing. */
    notes?: string;
    /** The page number where the edit was made. */
    page?: number;
    /** The type of the edited field. */
    fieldType?: string;
}
