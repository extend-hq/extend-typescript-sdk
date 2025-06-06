/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Extend from "../../../index";

/**
 * The configuration for the processor. The type of configuration must match the processor type. One of `cloneProcessorId` or `config` must be provided.
 */
export type ProcessorCreateRequestConfig =
    | Extend.ProcessorCreateRequestConfig.Classify
    | Extend.ProcessorCreateRequestConfig.Extract
    | Extend.ProcessorCreateRequestConfig.Splitter;

export namespace ProcessorCreateRequestConfig {
    export interface Classify extends Extend.ClassificationConfig {
        type: "CLASSIFY";
    }

    export interface Extract extends Extend.ExtractionConfig {
        type: "EXTRACT";
    }

    export interface Splitter extends Extend.SplitterConfig {
        type: "SPLITTER";
    }
}
