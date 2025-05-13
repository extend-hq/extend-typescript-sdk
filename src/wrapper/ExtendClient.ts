import { ExtendClient as FernGeneratedClient } from "../Client";
import * as core from "../core";
import * as Extend from "../api/index";
import { ApiVersionEnum } from "../api/index";

export class ExtendClient extends FernGeneratedClient {
    constructor(options: Omit<FernGeneratedClient.Options, "extendApiVersion">) {
        // Always force the extendApiVersion to be "2025-04-21"
        super({
            ...options,
            extendApiVersion: () => "2025-04-21",
        });
    }

    /**
     * The Extend API version used by this client
     */
    public readonly extendApiVersion: ApiVersionEnum = "2025-04-21";

    /**
     * Override the parse method to use a 5-minute timeout by default
     */
    public parse(
        request: Extend.ParseRequest,
        requestOptions?: FernGeneratedClient.RequestOptions,
    ): core.HttpResponsePromise<Extend.ParseResponse> {
        // Set default timeout to 5 minutes (300 seconds) if not specified
        const updatedOptions: FernGeneratedClient.RequestOptions = {
            ...requestOptions,
            timeoutInSeconds: requestOptions?.timeoutInSeconds ?? 300,
        };

        return super.parse(request, updatedOptions);
    }
}
