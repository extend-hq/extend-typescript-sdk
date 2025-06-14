/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Extend from "../../../../index";

/**
 * @example
 *     {
 *         processorId: "processor_id_here",
 *         nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
 *     }
 */
export interface EvaluationSetListRequest {
    /**
     * The ID of the processor to filter evaluation sets by.
     *
     * Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`
     */
    processorId?: string;
    /**
     * Sorts the evaluation sets by the given field.
     */
    sortBy?: Extend.SortByEnum;
    /**
     * Sorts the evaluation sets in ascending or descending order. Ascending order means the earliest evaluation set is returned first.
     */
    sortDir?: Extend.SortDirEnum;
    nextPageToken?: Extend.NextPageToken;
    maxPageSize?: Extend.MaxPageSize;
}
