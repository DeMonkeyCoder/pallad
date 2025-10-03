import type { AccountToken } from "@/common/types.ts"
import { formatMina } from "@mina-js/utils"
import { Network, getAccountProperties } from "@palladco/pallad-core"
import { sessionPersistence } from "@palladco/vault"
import { getPublicKey, isDelegated, useVault } from "@palladco/vault"
import easyMeshGradient from "easy-mesh-gradient"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import useSWR from "swr"
import { useAppStore } from "../store/app"

export const useAccount = () => {
  const navigate = useNavigate()
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const currentNetworkId = useVault((state) => state.currentNetworkId)
  const getAccountsInfo = useVault((state) => state.getAccountsInfo)
  const restartWallet = useVault((state) => state.restartWallet)
  const _syncWallet = useVault((state) => state._syncWallet)
  const setVaultStateUninitialized = useAppStore(
    (state) => state.setVaultStateUninitialized,
  )
  const fetchWallet = async () => {
    await _syncWallet()
    const accountsInfo = getAccountsInfo(
      currentNetworkId,
      publicKey,
    ).accountInfo
    const chain = currentWallet.credential.credential?.chain
    const props = getAccountProperties(accountsInfo, chain ?? Network.Mina)
    return {
      ...props,
      accountsInfo,
    }
  }
  const publicKey = getPublicKey(currentWallet)
  const swr = useSWR(
    publicKey ? [publicKey, "account", currentNetworkId] : null,
    async () => await fetchWallet(),
    {
      refreshInterval: 30000,
    },
  )
  const rawBalance = useMemo(
    () => (swr.isLoading ? 0 : (swr.data?.balance ?? 0)),
    [swr],
  )
  const minaBalance = useMemo(
    () => rawBalance && formatMina(BigInt(rawBalance)),
    [rawBalance],
  )
  const tokens: AccountToken[] | undefined = useMemo(() => {
    if (!swr.isLoading) {
      const accountsInfo = swr.data?.accountsInfo
      if (accountsInfo) {
        return Object.keys(accountsInfo).map((tokenSymbol) => ({
          tokenSymbol,
          balance: {
            total: BigInt(accountsInfo[tokenSymbol].balance.total),
          },
        }))
      }
    }
  }, [swr])
  const gradientBackground = useMemo(
    () =>
      publicKey &&
      easyMeshGradient({
        seed: publicKey,
        hueRange: [180, 240],
      }),
    [publicKey],
  )
  const stakeDelegated = isDelegated(currentWallet)
  const copyWalletAddress = async () => {
    await navigator.clipboard.writeText(publicKey ?? "")
    toast.success("Address copied")
  }
  const lockWallet = async () => {
    await sessionPersistence.setItem("spendingPassword", "")
    navigate("/unlock")
    await useVault.persist.rehydrate()
  }
  const restartCurrentWallet = () => {
    restartWallet()
    setVaultStateUninitialized()
    return navigate("/")
  }
  return {
    ...swr,
    fetchWallet,
    minaBalance,
    tokens,
    gradientBackground,
    copyWalletAddress,
    currentWallet,
    publicKey,
    lockWallet,
    restartCurrentWallet,
    networkId: currentNetworkId,
    stakeDelegated,
  }
}
