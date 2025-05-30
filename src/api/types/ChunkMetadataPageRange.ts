/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * The page range this chunk covers. Often will just be a partial page, in which cases `start` and `end` will be the same.
 */
export interface ChunkMetadataPageRange {
    /** The starting page number (inclusive). */
    start: number;
    /** The ending page number (inclusive). */
    end: number;
}
