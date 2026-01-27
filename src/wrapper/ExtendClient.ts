/**
 * Extended Extend client with webhook utilities and polling methods.
 * This file is protected by .fernignore and will not be overwritten during regeneration.
 */

import { ExtendClient as FernClient } from "../Client";
import { ExtractRunsWrapper } from "./ExtractRunsWrapper";
import { Webhooks } from "./Webhooks";

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
 * // Use API methods
 * const run = await client.extractRuns.createAndPoll({
 *   file: { url: "https://example.com/doc.pdf" },
 *   extractor: { id: "extractor_123" },
 * });
 *
 * // Verify webhooks
 * const event = client.webhooks.unwrap(body, headers, secret);
 * ```
 */
export class ExtendClient extends FernClient {
    protected _extractRunsWrapper: ExtractRunsWrapper | undefined;

    public readonly webhooks: Webhooks = new Webhooks();

    public override get extractRuns(): ExtractRunsWrapper {
        return (this._extractRunsWrapper ??= new ExtractRunsWrapper(this._options));
    }
}
