/**
 * Extended Extend client with webhook utilities and polling methods.
 * This file is protected by .fernignore and will not be overwritten during regeneration.
 */

import { z } from "zod";
import { ExtendClient as FernClient } from "../Client";
import * as Extend from "../api";
import * as core from "../core";
import { ExtractRunsWrapper } from "./resources/extractRuns";
import {
  TypedExtractRun,
  TypedExtractorReference,
} from "./resources/extractRuns";
import { ExtractorsWrapper } from "./resources/extractors";
import { ExtractorVersionsWrapper } from "./resources/extractorVersions";
import { ClassifyRunsWrapper } from "./resources/classifyRuns";
import { SplitRunsWrapper } from "./resources/splitRuns";
import { WorkflowRunsWrapper } from "./resources/workflowRuns";
import { EditRunsWrapper } from "./resources/editRuns";
import { ParseRunsWrapper } from "./resources/parseRuns";
import { Webhooks } from "./webhooks";
import {
  TypedExtractConfig,
  isTypedConfig,
  convertTypedConfigToApiConfig,
} from "./schema/configConversion";

/**
 * Typed extraction request with inline config for the sync extract() method.
 */
export interface TypedExtractRequestWithConfig<T extends z.ZodRawShape>
  extends Omit<Extend.ExtractRequest, "config" | "extractor"> {
  config: TypedExtractConfig<T>;
  extractor?: never;
}

/**
 * Typed extraction request with extractor.overrideConfig for the sync extract() method.
 */
export interface TypedExtractRequestWithExtractor<T extends z.ZodRawShape>
  extends Omit<Extend.ExtractRequest, "config" | "extractor"> {
  extractor: TypedExtractorReference<T>;
  config?: never;
}

/**
 * Union of typed extract request forms.
 */
export type TypedExtractRequest<T extends z.ZodRawShape> =
  | TypedExtractRequestWithConfig<T>
  | TypedExtractRequestWithExtractor<T>;

export declare namespace ExtendClient {
  export type Options = FernClient.Options;
  export type RequestOptions = FernClient.RequestOptions;
}

/**
 * The Extend API client with webhook utilities and polling methods.
 *
 * @example
 * ```typescript
 * import { ExtendClient, extendCurrency } from "extend-ai";
 * import { z } from "zod";
 *
 * const client = new ExtendClient({ token: "your-api-key" });
 *
 * // Typed extraction with zod schema
 * const result = await client.extract({
 *   file: { url: "https://example.com/invoice.pdf" },
 *   config: {
 *     schema: z.object({
 *       invoice_number: z.string().nullable(),
 *       total: extendCurrency(),
 *     }),
 *     baseProcessor: "extraction_performance",
 *   },
 * });
 *
 * // result.output.value is fully typed!
 * console.log(result.output.value.invoice_number); // string | null
 * console.log(result.output.value.total.amount); // number | null
 *
 * // Verify webhooks
 * const event = client.webhooks.verifyAndParse(body, headers, secret);
 * ```
 */
export class ExtendClient extends FernClient {
  protected _extractRunsWrapper: ExtractRunsWrapper | undefined;
  protected _extractorsWrapper: ExtractorsWrapper | undefined;
  protected _extractorVersionsWrapper: ExtractorVersionsWrapper | undefined;
  protected _classifyRunsWrapper: ClassifyRunsWrapper | undefined;
  protected _splitRunsWrapper: SplitRunsWrapper | undefined;
  protected _workflowRunsWrapper: WorkflowRunsWrapper | undefined;
  protected _editRunsWrapper: EditRunsWrapper | undefined;
  protected _parseRunsWrapper: ParseRunsWrapper | undefined;

  public readonly webhooks: Webhooks = new Webhooks();

  public override get extractRuns(): ExtractRunsWrapper {
    return (this._extractRunsWrapper ??= new ExtractRunsWrapper(this._options));
  }

  public override get extractors(): ExtractorsWrapper {
    return (this._extractorsWrapper ??= new ExtractorsWrapper(this._options));
  }

  public override get extractorVersions(): ExtractorVersionsWrapper {
    return (this._extractorVersionsWrapper ??= new ExtractorVersionsWrapper(
      this._options
    ));
  }

  public override get classifyRuns(): ClassifyRunsWrapper {
    return (this._classifyRunsWrapper ??= new ClassifyRunsWrapper(
      this._options
    ));
  }

  public override get splitRuns(): SplitRunsWrapper {
    return (this._splitRunsWrapper ??= new SplitRunsWrapper(this._options));
  }

  public override get workflowRuns(): WorkflowRunsWrapper {
    return (this._workflowRunsWrapper ??= new WorkflowRunsWrapper(
      this._options
    ));
  }

  public override get editRuns(): EditRunsWrapper {
    return (this._editRunsWrapper ??= new EditRunsWrapper(this._options));
  }

  public override get parseRuns(): ParseRunsWrapper {
    return (this._parseRunsWrapper ??= new ParseRunsWrapper(this._options));
  }

  /**
   * Extract structured data from a file synchronously with optional typed schema support.
   *
   * When you pass a zod schema via `config.schema`, the returned `ExtractRun`
   * will have fully typed `output.value` based on your schema.
   *
   * **Note:** This endpoint waits for completion. For production workloads with large files,
   * consider using `extractRuns.create()` with webhooks or `extractRuns.createAndPoll()`.
   *
   * @example
   * ```typescript
   * import { ExtendClient, extendCurrency } from "extend-ai";
   * import { z } from "zod";
   *
   * const client = new ExtendClient({ token: "..." });
   *
   * const result = await client.extract({
   *   file: { url: "https://example.com/invoice.pdf" },
   *   config: {
   *     schema: z.object({
   *       invoice_number: z.string().nullable(),
   *       total: extendCurrency(),
   *     }),
   *     baseProcessor: "extraction_performance",
   *   },
   * });
   *
   * // result.output.value is fully typed!
   * console.log(result.output.value.invoice_number); // string | null
   * console.log(result.output.value.total.amount); // number | null
   * ```
   */

  // Overload 1: Typed inline config - returns typed response
  public override extract<T extends z.ZodRawShape>(
    request: TypedExtractRequestWithConfig<T>,
    requestOptions?: ExtendClient.RequestOptions
  ): core.HttpResponsePromise<TypedExtractRun<z.infer<z.ZodObject<T>>>>;

  // Overload 2: Typed extractor.overrideConfig - returns typed response
  public override extract<T extends z.ZodRawShape>(
    request: TypedExtractRequestWithExtractor<T>,
    requestOptions?: ExtendClient.RequestOptions
  ): core.HttpResponsePromise<TypedExtractRun<z.infer<z.ZodObject<T>>>>;

  // Overload 3: Standard request - returns standard response
  public override extract(
    request: Extend.ExtractRequest,
    requestOptions?: ExtendClient.RequestOptions
  ): core.HttpResponsePromise<Extend.ExtractRun>;

  // Implementation
  public override extract<T extends z.ZodRawShape>(
    request: TypedExtractRequest<T> | Extend.ExtractRequest,
    requestOptions?: ExtendClient.RequestOptions
  ): core.HttpResponsePromise<
    TypedExtractRun<z.infer<z.ZodObject<T>>> | Extend.ExtractRun
  > {
    // Convert typed schema to API format if needed
    const apiRequest = this.convertExtractRequest(request);

    // Call the base class extract method
    return super.extract(
      apiRequest,
      requestOptions
    ) as core.HttpResponsePromise<
      TypedExtractRun<z.infer<z.ZodObject<T>>> | Extend.ExtractRun
    >;
  }

  /**
   * Converts a potentially typed extract request to the standard API request format.
   */
  private convertExtractRequest<T extends z.ZodRawShape>(
    request: TypedExtractRequest<T> | Extend.ExtractRequest
  ): Extend.ExtractRequest {
    // Case 1: Typed inline config
    if (
      "config" in request &&
      request.config &&
      isTypedConfig(request.config)
    ) {
      return {
        file: request.file,
        metadata: request.metadata,
        config: convertTypedConfigToApiConfig(request.config),
      };
    }

    // Case 2: Typed extractor.overrideConfig
    if (
      "extractor" in request &&
      request.extractor &&
      "overrideConfig" in request.extractor
    ) {
      const extractor = request.extractor;
      if (isTypedConfig(extractor.overrideConfig)) {
        return {
          file: request.file,
          metadata: request.metadata,
          extractor: {
            id: extractor.id,
            version: extractor.version,
            overrideConfig: convertTypedConfigToApiConfig(
              extractor.overrideConfig
            ),
          },
        };
      }
    }

    // Case 3: Standard request (no typed schema)
    return request as Extend.ExtractRequest;
  }
}
