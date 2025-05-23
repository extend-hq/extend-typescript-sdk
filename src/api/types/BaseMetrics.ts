/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Base metrics common to all processor types
 */
export interface BaseMetrics {
    /** The total number of files that were processed. */
    numFiles?: number;
    /** The total number of pages that were processed. */
    numPages?: number;
    /** The mean runtime in milliseconds per document. */
    meanRunTimeMs?: number;
}
