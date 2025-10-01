import type { AccountInfo } from "@palladco/pallad-core"
import { type ProviderConfig, createChainProvider } from "@palladco/providers"

export async function syncAccountHelper(
  get: any,
  providerConfig: ProviderConfig,
  publicKey: string,
) {
  const { setAccountInfo, getTokensInfo, setTokensInfo } = get()
  const provider = createChainProvider(providerConfig)
  const accountsInfo = await provider.getAccountsInfo({
    publicKey: publicKey,
  })
  if (accountsInfo === undefined) {
    throw new Error("accountInfo is undefined in _syncAccountInfo")
  }

  const tokensInfo = await provider.getTokenInfo({
    tokenIds: accountsInfo.map((a) => a.tokenId),
  })
  let tokenMap = getTokensInfo(providerConfig.networkId)
  for (const [tokenId, tokenInfo] of Object.entries(tokensInfo)) {
    tokenMap = {
      ...tokenMap,
      [tokenInfo?.tokenSymbol ?? "MINA"]: tokenId,
    }
  }
  setTokensInfo(providerConfig.networkId, tokenMap)

  const accountInfo: Record<string, AccountInfo> = {}
  for (const ticker in tokenMap) {
    accountInfo[ticker] = accountsInfo.find(
      (a) => a.tokenId === tokenMap[ticker],
    ) ?? {
      balance: { total: 0 },
      nonce: 0,
      inferredNonce: 0,
      delegate: "",
      publicKey: publicKey,
      tokenId: "",
    }
  }

  return setAccountInfo(providerConfig.networkId, publicKey, accountInfo)
}
