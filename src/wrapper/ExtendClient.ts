/**
 * Extended Extend client with webhook utilities.
 * This file is protected by .fernignore and will not be overwritten during regeneration.
 */

import { ExtendClient as FernClient } from "../Client";
import { Webhooks } from "./Webhooks";

export declare namespace ExtendClient {
    export type Options = FernClient.Options;
    export type RequestOptions = FernClient.RequestOptions;
}

/**
 * The Extend API client with webhook utilities.
 *
 * @example
 * ```typescript
 * import { ExtendClient } from "extend-ai";
 *
 * const client = new ExtendClient({ token: "your-api-key" });
 *
 * // Use API methods
 * const run = await client.workflowRun.get("wr_123");
 *
 * // Verify webhooks
 * const event = client.webhooks.unwrap(body, headers, secret);
 * ```
 */
export class ExtendClient extends FernClient {
    public readonly webhooks: Webhooks = new Webhooks();
}
