import { ExtendClient as FernGeneratedClient } from "../Client";

export class ExtendClient extends FernGeneratedClient {
  constructor(options: Omit<FernGeneratedClient.Options, 'extendApiVersion'>) {
    // Always force the extendApiVersion to be "2025-04-21"
    super({
      ...options,
      extendApiVersion: () => "2025-04-21"
    });
  }

}