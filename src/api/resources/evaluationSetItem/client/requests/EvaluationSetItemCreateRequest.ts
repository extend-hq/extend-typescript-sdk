/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Extend from "../../../../index";

/**
 * @example
 *     {
 *         evaluationSetId: "evaluation_set_id_here",
 *         fileId: "file_id_here",
 *         expectedOutput: {
 *             value: {
 *                 "key": "value"
 *             }
 *         }
 *     }
 */
export interface EvaluationSetItemCreateRequest {
    /**
     * The ID of the evaluation set to add the item to.
     *
     * Example: `"ev_Xj8mK2pL9nR4vT7qY5wZ"`
     */
    evaluationSetId: string;
    /**
     * Extend's internal ID for the file. It will always start with "file_".
     *
     * Example: `"file_xK9mLPqRtN3vS8wF5hB2cQ"`
     */
    fileId: string;
    /** The expected output that will be used to evaluate the processor's performance. */
    expectedOutput: Extend.ProvidedProcessorOutput;
}
