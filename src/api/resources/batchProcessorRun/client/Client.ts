/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Extend from "../../../index";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace BatchProcessorRun {
    export interface Options {
        environment?: core.Supplier<environments.ExtendEnvironment | string>;
        /** Specify a custom URL to connect the client to. */
        baseUrl?: core.Supplier<string>;
        token: core.Supplier<core.BearerToken>;
        /** Override the x-extend-api-version header */
        extendApiVersion?: "2025-04-21";
        fetcher?: core.FetchFunction;
    }

    export interface RequestOptions {
        /** The maximum time to wait for a response in seconds. */
        timeoutInSeconds?: number;
        /** The number of times to retry the request. Defaults to 2. */
        maxRetries?: number;
        /** A hook to abort the request. */
        abortSignal?: AbortSignal;
        /** Override the x-extend-api-version header */
        extendApiVersion?: "2025-04-21";
        /** Additional headers to include in the request. */
        headers?: Record<string, string>;
    }
}

export class BatchProcessorRun {
    constructor(protected readonly _options: BatchProcessorRun.Options) {}

    /**
     * Retrieve details about a batch processor run, including evaluation runs
     *
     * @param {string} id - The unique identifier of the batch processor run to retrieve. The ID will always start with "bpr_".
     *
     *                      Example: `"bpr_Xj8mK2pL9nR4vT7qY5wZ"`
     * @param {BatchProcessorRun.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Extend.BadRequestError}
     * @throws {@link Extend.UnauthorizedError}
     * @throws {@link Extend.NotFoundError}
     *
     * @example
     *     await client.batchProcessorRun.get("batch_processor_run_id_here")
     */
    public get(
        id: string,
        requestOptions?: BatchProcessorRun.RequestOptions,
    ): core.HttpResponsePromise<Extend.BatchProcessorRunGetResponse> {
        return core.HttpResponsePromise.fromPromise(this.__get(id, requestOptions));
    }

    private async __get(
        id: string,
        requestOptions?: BatchProcessorRun.RequestOptions,
    ): Promise<core.WithRawResponse<Extend.BatchProcessorRunGetResponse>> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ExtendEnvironment.Production,
                `batch_processor_runs/${encodeURIComponent(id)}`,
            ),
            method: "GET",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "x-extend-api-version":
                    requestOptions?.extendApiVersion ?? this._options?.extendApiVersion ?? "2025-04-21",
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "extend-ai",
                "X-Fern-SDK-Version": "0.0.3",
                "User-Agent": "extend-ai/0.0.3",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...requestOptions?.headers,
            },
            contentType: "application/json",
            requestType: "json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 300000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return { data: _response.body as Extend.BatchProcessorRunGetResponse, rawResponse: _response.rawResponse };
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new Extend.BadRequestError(_response.error.body as unknown, _response.rawResponse);
                case 401:
                    throw new Extend.UnauthorizedError(_response.error.body as Extend.Error_, _response.rawResponse);
                case 404:
                    throw new Extend.NotFoundError(_response.error.body as Extend.Error_, _response.rawResponse);
                default:
                    throw new errors.ExtendError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                        rawResponse: _response.rawResponse,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ExtendError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                    rawResponse: _response.rawResponse,
                });
            case "timeout":
                throw new errors.ExtendTimeoutError("Timeout exceeded when calling GET /batch_processor_runs/{id}.");
            case "unknown":
                throw new errors.ExtendError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }

    protected async _getAuthorizationHeader(): Promise<string> {
        return `Bearer ${await core.Supplier.get(this._options.token)}`;
    }
}
