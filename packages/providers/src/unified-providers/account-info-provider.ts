import type {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse,
} from "@palladco/pallad-core"

import { createAccountInfoProvider as mn } from "../mina-node"
import type { ProviderConfig } from "./types"

export const createAccountInfoProvider = (
  config: ProviderConfig,
): AccountInfoProvider => {
  // TODO: make the underlyingProvider creation a util function
  const underlyingProvider = mn(config.nodeEndpoint.url)

  const getAccountInfo = async (
    args: AccountInfoArgs,
  ): Promise<Record<string, AccountInfo>> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return underlyingProvider.getAccountInfo(args)
  }

  const getAccountsInfo = async (
    args: AccountInfoArgs,
  ): Promise<AccountInfo[]> => {
    // Delegate the call to the underlying provider's getAccountsInfo method
    return underlyingProvider.getAccountsInfo(args)
  }

  const healthCheck = async (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return underlyingProvider.healthCheck()
  }

  return {
    getAccountInfo,
    getAccountsInfo,
    healthCheck,
  }
}
