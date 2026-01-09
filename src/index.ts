export * as Extend from "./api";
export { ExtendError, ExtendTimeoutError } from "./errors";
export { ExtendEnvironment } from "./environments";

// Export the extended client (with webhooks) instead of the generated client
export { ExtendClient } from "./wrapper/ExtendClient";
