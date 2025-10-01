import type {
  AccountInfoArgs,
  HealthCheckResponse,
  TokenInfoArgs,
  TransactionsByAddressesArgs,
  UnifiedChainProviderType,
} from "@palladco/pallad-core"

import { createAccountInfoProvider } from "./account-info-provider"
import { createChainHistoryProvider } from "./chain-history-provider"
import { createNodeStatusProvider } from "./node-status-provider"
import { createTokenInfoProvider } from "./token-info-provider"
import type { ProviderConfig } from "./types"

export const createChainProvider = (
  config: ProviderConfig,
): UnifiedChainProviderType => {
  const getAccountInfo = async (args: AccountInfoArgs) => {
    return createAccountInfoProvider(config).getAccountInfo(args)
  }

  const getAccountsInfo = async (args: AccountInfoArgs) => {
    return createAccountInfoProvider(config).getAccountsInfo(args)
  }

  const getTokenInfo = async (args: TokenInfoArgs) => {
    return createTokenInfoProvider(config).getTokenInfo(args)
  }

  const getTransactions = async (args: TransactionsByAddressesArgs) => {
    return createChainHistoryProvider(config).transactionsByAddresses(args)
  }

  const getNodeStatus = async () => {
    return createNodeStatusProvider(config).getNodeStatus()
  }

  const healthCheckNode = async () => {
    return createAccountInfoProvider(config).healthCheck()
  }

  const healthCheckArchive = async () => {
    return createChainHistoryProvider(config).healthCheck()
  }

  const healthCheck = async () => {
    const node = await healthCheckNode()
    let archiveResult: HealthCheckResponse = { ok: true, message: "" }

    if (config.archiveNodeEndpoint) {
      archiveResult = await healthCheckArchive()
    }

    const ok = node.ok && archiveResult.ok
    const messages = [node.message, archiveResult.message]
      .filter((msg) => typeof msg === "string" && msg)
      .join(" ")

    return {
      ok,
      message: messages,
    }
  }

  return {
    getAccountInfo,
    getAccountsInfo,
    getTokenInfo,
    getTransactions,
    getNodeStatus,
    healthCheck,
  }
}
