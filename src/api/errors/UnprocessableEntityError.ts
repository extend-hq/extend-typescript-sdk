/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as errors from "../../errors/index";
import * as Extend from "../index";
import * as core from "../../core";

export class UnprocessableEntityError extends errors.ExtendError {
    constructor(body: Extend.Error_, rawResponse?: core.RawResponse) {
        super({
            message: "UnprocessableEntityError",
            statusCode: 422,
            body: body,
            rawResponse: rawResponse,
        });
        Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
    }
}
