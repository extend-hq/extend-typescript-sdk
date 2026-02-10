/**
 * Extended Extractors client with Zod schema support.
 *
 * Allows passing Zod schemas in the `config.schema` field for
 * `create()` and `update()` methods. The Zod schema is automatically
 * converted to JSON Schema before sending to the API.
 *
 * @example
 * ```typescript
 * import { ExtendClient, extendDate, extendCurrency } from "extend-ai";
 * import { z } from "zod";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * const extractor = await client.extractors.create({
 *   name: "Invoice Extractor",
 *   config: {
 *     schema: z.object({
 *       vendor: z.string().nullable(),
 *       invoice_date: extendDate(),
 *       total: extendCurrency(),
 *     }),
 *   },
 * });
 * ```
 */

import { z } from "zod";
import { ExtractorsClient as GeneratedExtractorsClient } from "../../../api/resources/extractors/client/Client";
import * as Extend from "../../../api";
import * as core from "../../../core";
import {
  TypedExtractConfig,
  isTypedConfig,
  convertTypedConfigToApiConfig,
} from "../../schema/configConversion";

/**
 * Extractor create request with a typed Zod schema in config.
 *
 * Note: `cloneExtractorId` is excluded because it is mutually exclusive with `config`.
 * The API will reject requests that provide both.
 */
export interface TypedExtractorsCreateRequest<T extends z.ZodRawShape>
  extends Omit<Extend.ExtractorsCreateRequest, "config" | "cloneExtractorId"> {
  /** The configuration for the extractor, with a Zod schema. */
  config: TypedExtractConfig<T>;
}

/**
 * Extractor update request with a typed Zod schema in config.
 */
export interface TypedExtractorsUpdateRequest<T extends z.ZodRawShape>
  extends Omit<Extend.ExtractorsUpdateRequest, "config"> {
  /** The new configuration for the extractor, with a Zod schema. */
  config: TypedExtractConfig<T>;
}

export class ExtractorsClient extends GeneratedExtractorsClient {
  /**
   * Create a new extractor.
   *
   * Accepts a Zod schema in `config.schema` which will be automatically
   * converted to JSON Schema before sending to the API.
   *
   * @example
   * ```typescript
   * // With Zod schema
   * const extractor = await client.extractors.create({
   *   name: "Invoice Extractor",
   *   config: {
   *     schema: z.object({
   *       vendor: z.string().nullable(),
   *       total: extendCurrency(),
   *     }),
   *   },
   * });
   *
   * // With JSON Schema (standard)
   * const extractor = await client.extractors.create({
   *   name: "Invoice Extractor",
   *   config: {
   *     schema: { type: "object", properties: { vendor: { type: "string" } } },
   *   },
   * });
   * ```
   */

  // Overload 1: Typed config with Zod schema
  public override create<T extends z.ZodRawShape>(
    request: TypedExtractorsCreateRequest<T>,
    requestOptions?: GeneratedExtractorsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.Extractor>;

  // Overload 2: Standard request
  public override create(
    request: Extend.ExtractorsCreateRequest,
    requestOptions?: GeneratedExtractorsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.Extractor>;

  // Implementation
  public override create<T extends z.ZodRawShape>(
    request: TypedExtractorsCreateRequest<T> | Extend.ExtractorsCreateRequest,
    requestOptions?: GeneratedExtractorsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.Extractor> {
    const apiRequest = this.convertCreateRequest(request);
    return super.create(apiRequest, requestOptions);
  }

  /**
   * Update an existing extractor.
   *
   * Accepts a Zod schema in `config.schema` which will be automatically
   * converted to JSON Schema before sending to the API.
   *
   * @example
   * ```typescript
   * const extractor = await client.extractors.update("ex_abc123", {
   *   config: {
   *     schema: z.object({
   *       vendor: z.string().nullable(),
   *       total: extendCurrency(),
   *     }),
   *   },
   * });
   * ```
   */

  // Overload 1: Typed config with Zod schema
  public override update<T extends z.ZodRawShape>(
    id: string,
    request: TypedExtractorsUpdateRequest<T>,
    requestOptions?: GeneratedExtractorsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.Extractor>;

  // Overload 2: Standard request
  public override update(
    id: string,
    request?: Extend.ExtractorsUpdateRequest,
    requestOptions?: GeneratedExtractorsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.Extractor>;

  // Implementation
  public override update<T extends z.ZodRawShape>(
    id: string,
    request:
      | TypedExtractorsUpdateRequest<T>
      | Extend.ExtractorsUpdateRequest = {},
    requestOptions?: GeneratedExtractorsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.Extractor> {
    const apiRequest = this.convertUpdateRequest(request);
    return super.update(id, apiRequest, requestOptions);
  }

  /**
   * Converts a potentially typed create request to the standard API request format.
   */
  private convertCreateRequest<T extends z.ZodRawShape>(
    request: TypedExtractorsCreateRequest<T> | Extend.ExtractorsCreateRequest
  ): Extend.ExtractorsCreateRequest {
    if (request.config && isTypedConfig(request.config)) {
      return {
        ...request,
        config: convertTypedConfigToApiConfig(request.config),
      };
    }
    return request as Extend.ExtractorsCreateRequest;
  }

  /**
   * Converts a potentially typed update request to the standard API request format.
   */
  private convertUpdateRequest<T extends z.ZodRawShape>(
    request: TypedExtractorsUpdateRequest<T> | Extend.ExtractorsUpdateRequest
  ): Extend.ExtractorsUpdateRequest {
    if (request.config && isTypedConfig(request.config)) {
      return {
        ...request,
        config: convertTypedConfigToApiConfig(request.config),
      };
    }
    return request as Extend.ExtractorsUpdateRequest;
  }
}
