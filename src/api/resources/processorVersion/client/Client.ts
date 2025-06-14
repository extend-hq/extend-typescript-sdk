/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Extend from "../../../index";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace ProcessorVersion {
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

export class ProcessorVersion {
    constructor(protected readonly _options: ProcessorVersion.Options) {}

    /**
     * Retrieve a specific version of a processor in Extend
     *
     * @param {string} processorId - The ID of the processor.
     *
     *                               Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`
     * @param {string} processorVersionId - The ID of the specific processor version to retrieve.
     *
     *                                      Example: `"dpv_QYk6jgHA_8CsO8rVWhyNC"`
     * @param {ProcessorVersion.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Extend.BadRequestError}
     * @throws {@link Extend.UnauthorizedError}
     * @throws {@link Extend.NotFoundError}
     *
     * @example
     *     await client.processorVersion.get("processor_id_here", "processor_version_id_here")
     */
    public get(
        processorId: string,
        processorVersionId: string,
        requestOptions?: ProcessorVersion.RequestOptions,
    ): core.HttpResponsePromise<Extend.ProcessorVersionGetResponse> {
        return core.HttpResponsePromise.fromPromise(this.__get(processorId, processorVersionId, requestOptions));
    }

    private async __get(
        processorId: string,
        processorVersionId: string,
        requestOptions?: ProcessorVersion.RequestOptions,
    ): Promise<core.WithRawResponse<Extend.ProcessorVersionGetResponse>> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ExtendEnvironment.Production,
                `processors/${encodeURIComponent(processorId)}/versions/${encodeURIComponent(processorVersionId)}`,
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
            return { data: _response.body as Extend.ProcessorVersionGetResponse, rawResponse: _response.rawResponse };
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
                throw new errors.ExtendTimeoutError(
                    "Timeout exceeded when calling GET /processors/{processorId}/versions/{processorVersionId}.",
                );
            case "unknown":
                throw new errors.ExtendError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }

    /**
     * This endpoint allows you to fetch all versions of a given processor, including the current `draft` version.
     *
     * Versions are typically returned in descending order of creation (newest first), but this should be confirmed in the actual implementation.
     * The `draft` version is the latest unpublished version of the processor, which can be published to create a new version. It might not have any changes from the last published version.
     *
     * @param {string} id - The ID of the processor to retrieve versions for.
     *
     *                      Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`
     * @param {ProcessorVersion.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Extend.BadRequestError}
     * @throws {@link Extend.UnauthorizedError}
     * @throws {@link Extend.NotFoundError}
     *
     * @example
     *     await client.processorVersion.list("processor_id_here")
     */
    public list(
        id: string,
        requestOptions?: ProcessorVersion.RequestOptions,
    ): core.HttpResponsePromise<Extend.ProcessorVersionListResponse> {
        return core.HttpResponsePromise.fromPromise(this.__list(id, requestOptions));
    }

    private async __list(
        id: string,
        requestOptions?: ProcessorVersion.RequestOptions,
    ): Promise<core.WithRawResponse<Extend.ProcessorVersionListResponse>> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ExtendEnvironment.Production,
                `processors/${encodeURIComponent(id)}/versions`,
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
            return { data: _response.body as Extend.ProcessorVersionListResponse, rawResponse: _response.rawResponse };
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
                throw new errors.ExtendTimeoutError("Timeout exceeded when calling GET /processors/{id}/versions.");
            case "unknown":
                throw new errors.ExtendError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }

    /**
     * This endpoint allows you to publish a new version of an existing processor. Publishing a new version creates a snapshot of the processor's current configuration and makes it available for use in workflows.
     *
     * Publishing a new version does not automatically update existing workflows using this processor. You may need to manually update workflows to use the new version if desired.
     *
     * @param {string} id - The ID of the processor to publish a new version for.
     *
     *                      Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`
     * @param {Extend.ProcessorVersionCreateRequest} request
     * @param {ProcessorVersion.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Extend.BadRequestError}
     * @throws {@link Extend.UnauthorizedError}
     *
     * @example
     *     await client.processorVersion.create("processor_id_here", {
     *         releaseType: "major"
     *     })
     */
    public create(
        id: string,
        request: Extend.ProcessorVersionCreateRequest,
        requestOptions?: ProcessorVersion.RequestOptions,
    ): core.HttpResponsePromise<Extend.ProcessorVersionCreateResponse> {
        return core.HttpResponsePromise.fromPromise(this.__create(id, request, requestOptions));
    }

    private async __create(
        id: string,
        request: Extend.ProcessorVersionCreateRequest,
        requestOptions?: ProcessorVersion.RequestOptions,
    ): Promise<core.WithRawResponse<Extend.ProcessorVersionCreateResponse>> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ExtendEnvironment.Production,
                `processors/${encodeURIComponent(id)}/publish`,
            ),
            method: "POST",
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
            body: request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 300000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                data: _response.body as Extend.ProcessorVersionCreateResponse,
                rawResponse: _response.rawResponse,
            };
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new Extend.BadRequestError(_response.error.body as unknown, _response.rawResponse);
                case 401:
                    throw new Extend.UnauthorizedError(_response.error.body as Extend.Error_, _response.rawResponse);
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
                throw new errors.ExtendTimeoutError("Timeout exceeded when calling POST /processors/{id}/publish.");
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
