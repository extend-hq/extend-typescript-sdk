/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Extend from "../index";

/**
 * Contains the relevant object for the event type
 */
export type WebhookEventPayload =
    | Extend.WorkflowRun
    | Extend.ProcessorRun
    | Extend.Workflow
    | Extend.Processor
    | Extend.ProcessorVersion;
