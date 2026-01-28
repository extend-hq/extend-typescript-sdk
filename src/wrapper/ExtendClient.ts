/**
 * Extended Extend client with webhook utilities and polling methods.
 * This file is protected by .fernignore and will not be overwritten during regeneration.
 */

import { ExtendClient as FernClient } from "../Client";
import { ExtractRunsWrapper } from "./resources/extractRuns";
import { ClassifyRunsWrapper } from "./resources/classifyRuns";
import { SplitRunsWrapper } from "./resources/splitRuns";
import { WorkflowRunsWrapper } from "./resources/workflowRuns";
import { EditRunsWrapper } from "./resources/editRuns";
import { ParseRunsWrapper } from "./resources/parseRuns";
import { Webhooks } from "./webhooks";

export declare namespace ExtendClient {
    export type Options = FernClient.Options;
    export type RequestOptions = FernClient.RequestOptions;
}

/**
 * The Extend API client with webhook utilities and polling methods.
 *
 * @example
 * ```typescript
 * import { ExtendClient } from "extend-ai";
 *
 * const client = new ExtendClient({ token: "your-api-key" });
 *
 * // Use createAndPoll for convenient polling
 * const extractResult = await client.extractRuns.createAndPoll({
 *   file: { url: "https://example.com/doc.pdf" },
 *   extractor: { id: "extractor_123" },
 * });
 *
 * const classifyResult = await client.classifyRuns.createAndPoll({
 *   file: { url: "https://example.com/doc.pdf" },
 *   classifier: { id: "classifier_123" },
 * });
 *
 * const workflowResult = await client.workflowRuns.createAndPoll({
 *   file: { url: "https://example.com/doc.pdf" },
 *   workflow: { id: "workflow_123" },
 * });
 *
 * // Verify webhooks
 * const event = client.webhooks.verifyAndParse(body, headers, secret);
 * ```
 */
export class ExtendClient extends FernClient {
    protected _extractRunsWrapper: ExtractRunsWrapper | undefined;
    protected _classifyRunsWrapper: ClassifyRunsWrapper | undefined;
    protected _splitRunsWrapper: SplitRunsWrapper | undefined;
    protected _workflowRunsWrapper: WorkflowRunsWrapper | undefined;
    protected _editRunsWrapper: EditRunsWrapper | undefined;
    protected _parseRunsWrapper: ParseRunsWrapper | undefined;

    public readonly webhooks: Webhooks = new Webhooks();

    public override get extractRuns(): ExtractRunsWrapper {
        return (this._extractRunsWrapper ??= new ExtractRunsWrapper(this._options));
    }

    public override get classifyRuns(): ClassifyRunsWrapper {
        return (this._classifyRunsWrapper ??= new ClassifyRunsWrapper(this._options));
    }

    public override get splitRuns(): SplitRunsWrapper {
        return (this._splitRunsWrapper ??= new SplitRunsWrapper(this._options));
    }

    public override get workflowRuns(): WorkflowRunsWrapper {
        return (this._workflowRunsWrapper ??= new WorkflowRunsWrapper(this._options));
    }

    public override get editRuns(): EditRunsWrapper {
        return (this._editRunsWrapper ??= new EditRunsWrapper(this._options));
    }

    public override get parseRuns(): ParseRunsWrapper {
        return (this._parseRunsWrapper ??= new ParseRunsWrapper(this._options));
    }
}
