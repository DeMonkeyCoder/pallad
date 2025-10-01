import type {
  HealthCheckResponse,
  TokenInfo,
  TokenInfoArgs,
  TokenInfoProvider,
} from "@palladco/pallad-core"

import { createTokenInfoProvider as mn } from "../mina-node"
import type { ProviderConfig } from "./types"

export const createTokenInfoProvider = (
  config: ProviderConfig,
): TokenInfoProvider => {
  // TODO: make the underlyingProvider creation a util function
  const underlyingProvider = mn(config.nodeEndpoint.url)

  const getTokenInfo = async (
    args: TokenInfoArgs,
  ): Promise<Record<string, TokenInfo>> => {
    // Delegate the call to the underlying provider's getTokenInfo method
    return underlyingProvider.getTokenInfo(args)
  }

  const getTokensInfo = async (args: TokenInfoArgs): Promise<TokenInfo[]> => {
    // Delegate the call to the underlying provider's getTokensInfo method
    return underlyingProvider.getTokensInfo(args)
  }

  const healthCheck = async (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return underlyingProvider.healthCheck()
  }

  return {
    getTokenInfo,
    getTokensInfo,
    healthCheck,
  }
}
