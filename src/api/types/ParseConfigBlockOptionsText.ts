/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Options for text blocks.
 */
export interface ParseConfigBlockOptionsText {
    /** Whether an additional vision model will be utilized for advanced signature detection. Recommended for most use cases, but should be disabled if signature detection is not necessary and latency is a concern. */
    signatureDetectionEnabled?: boolean;
}
