/**
 * Extended ExtractorVersions client with Zod schema support.
 *
 * Allows passing Zod schemas in the `config.schema` field for the
 * `create()` method. The Zod schema is automatically converted to
 * JSON Schema before sending to the API.
 *
 * @example
 * ```typescript
 * import { ExtendClient, extendDate, extendCurrency } from "extend-ai";
 * import { z } from "zod";
 *
 * const client = new ExtendClient({ token: "..." });
 *
 * const version = await client.extractorVersions.create("ex_abc123", {
 *   releaseType: "minor",
 *   description: "Added currency field",
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
import { ExtractorVersionsClient } from "../../../api/resources/extractorVersions/client/Client";
import * as Extend from "../../../api";
import * as core from "../../../core";
import {
  TypedExtractConfig,
  isTypedConfig,
  convertTypedConfigToApiConfig,
} from "../../schema/configConversion";

/**
 * Extractor version create request with a typed Zod schema in config.
 */
export interface TypedExtractorVersionsCreateRequest<T extends z.ZodRawShape>
  extends Omit<Extend.ExtractorVersionsCreateRequest, "config"> {
  /** The configuration for this version of the extractor, with a Zod schema. */
  config: TypedExtractConfig<T>;
}

export class ExtractorVersionsWrapper extends ExtractorVersionsClient {
  /**
   * Publish a new version of an existing extractor.
   *
   * Accepts a Zod schema in `config.schema` which will be automatically
   * converted to JSON Schema before sending to the API.
   *
   * @example
   * ```typescript
   * // With Zod schema
   * const version = await client.extractorVersions.create("ex_abc123", {
   *   releaseType: "minor",
   *   config: {
   *     schema: z.object({
   *       vendor: z.string().nullable(),
   *       total: extendCurrency(),
   *     }),
   *   },
   * });
   *
   * // With JSON Schema (standard)
   * const version = await client.extractorVersions.create("ex_abc123", {
   *   releaseType: "minor",
   *   config: {
   *     schema: { type: "object", properties: { vendor: { type: "string" } } },
   *   },
   * });
   * ```
   */

  // Overload 1: Typed config with Zod schema
  public override create<T extends z.ZodRawShape>(
    extractorId: string,
    request: TypedExtractorVersionsCreateRequest<T>,
    requestOptions?: ExtractorVersionsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.ExtractorVersion>;

  // Overload 2: Standard request
  public override create(
    extractorId: string,
    request: Extend.ExtractorVersionsCreateRequest,
    requestOptions?: ExtractorVersionsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.ExtractorVersion>;

  // Implementation
  public override create<T extends z.ZodRawShape>(
    extractorId: string,
    request:
      | TypedExtractorVersionsCreateRequest<T>
      | Extend.ExtractorVersionsCreateRequest,
    requestOptions?: ExtractorVersionsClient.RequestOptions
  ): core.HttpResponsePromise<Extend.ExtractorVersion> {
    const apiRequest = this.convertCreateRequest(request);
    return super.create(extractorId, apiRequest, requestOptions);
  }

  /**
   * Converts a potentially typed create request to the standard API request format.
   */
  private convertCreateRequest<T extends z.ZodRawShape>(
    request:
      | TypedExtractorVersionsCreateRequest<T>
      | Extend.ExtractorVersionsCreateRequest
  ): Extend.ExtractorVersionsCreateRequest {
    if (request.config && isTypedConfig(request.config)) {
      return {
        ...request,
        config: convertTypedConfigToApiConfig(request.config),
      };
    }
    return request as Extend.ExtractorVersionsCreateRequest;
  }
}
