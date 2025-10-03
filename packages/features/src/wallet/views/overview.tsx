import ArrowRightIcon from "@/common/assets/arrow-right.svg?react"
import type { AccountToken } from "@/common/types.ts"
import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { Skeleton } from "@/components/skeleton"
import { formatMina } from "@mina-js/utils"
import type { Tx } from "@palladco/pallad-core"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import SlotCounter from "react-slot-counter"
import { PortfolioValueChart } from "../components/portfolio-value-chart"
import { TxTile } from "../components/tx-tile"

type OverviewViewProps = {
  lastMonthPrices: [number, number][]
  minaBalance: number
  fiatBalance: number
  chartLabel: string
  loading: boolean
  currentPriceIndex: number | undefined
  setCurrentPriceIndex: (currentPriceIndex: number | undefined) => void
  transactions: Tx[]
  publicAddress: string
  onSend: () => void
  onReceive: () => void
  useFiatBalance: boolean
  setUseFiatBalance: (useFiatBalance: boolean) => void
  isAssetsView: boolean
  setIsAssetsView: (isAssetsView: boolean) => void
  tokens: AccountToken[] | undefined
  minaDailyPriceDiffText: string
}

export const OverviewView = ({
  lastMonthPrices,
  minaBalance,
  fiatBalance,
  chartLabel,
  loading,
  currentPriceIndex,
  setCurrentPriceIndex,
  transactions,
  publicAddress,
  onSend,
  onReceive,
  useFiatBalance,
  setUseFiatBalance,
  isAssetsView,
  setIsAssetsView,
  tokens,
  minaDailyPriceDiffText,
}: OverviewViewProps) => {
  const [bucks, cents] = (useFiatBalance ? fiatBalance : minaBalance)
    .toFixed(2)
    .toString()
    .split(".")

  const { t } = useTranslation()
  return (
    <AppLayout>
      <MenuBar variant="dashboard" publicAddress={publicAddress} />
      <Skeleton loading={loading} h="62px">
        <PortfolioValueChart
          lastMonthPrices={lastMonthPrices}
          setCurrentPriceIndex={setCurrentPriceIndex}
          currentPriceIndex={currentPriceIndex}
        />
      </Skeleton>
      <div className="card flex-col bg-secondary rounded-t-none px-8 pb-6 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-primary">{t("wallet.portfolioValue")}</h1>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setUseFiatBalance(!useFiatBalance)}
          >
            {t("wallet.use")} {useFiatBalance ? "Mina" : "Fiat"}
          </button>
        </div>
        <Skeleton loading={loading} h="65px">
          <h2 className="flex items-end">
            <span className="flex items-center text-6xl">
              <span>{useFiatBalance ? "$" : "M"}</span>
              <SlotCounter value={bucks} charClassName="font-work-sans" />
            </span>
            <span className="flex items-end text-lg">
              <span>.</span>
              <SlotCounter value={cents} charClassName="font-work-sans" />
            </span>
          </h2>
        </Skeleton>
        <Skeleton loading={loading} h="24px">
          <p className="text-mint">{chartLabel}</p>
        </Skeleton>
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 btn btn-primary"
            onClick={onSend}
            data-testid="dashboard/send"
          >
            {t("wallet.send")}
          </button>
          <button
            type="button"
            className="flex-1 btn btn-primary"
            onClick={onReceive}
            data-testid="dashboard/receive"
          >
            {t("wallet.receive")}
          </button>
        </div>
      </div>
      <div className="flex flex-col px-8 py-4 gap-3 pb-16">
        <div className="p-1 flex bg-secondary rounded-full gap-4">
          <button
            type="button"
            className={`flex-1 btn ${isAssetsView ? "bg-neutral" : "btn-secondary"}`}
            onClick={() => setIsAssetsView(true)}
            data-testid="dashboard/assets"
          >
            {t("wallet.assets")}
          </button>
          <button
            type="button"
            className={`flex-1 btn ${isAssetsView ? "btn-secondary" : "bg-neutral"}`}
            onClick={() => setIsAssetsView(false)}
            data-testid="dashboard/recent"
          >
            {t("wallet.recent")}
          </button>
        </div>
        {isAssetsView ? (
          <>
            <h2 className="text-xl">{t("wallet.tokens")}</h2>
            <div className="flex flex-col space-y-4">
              {tokens === undefined ? (
                <>
                  <Skeleton loading={true} h="70px" />
                  <Skeleton loading={true} h="70px" />
                </>
              ) : (
                tokens.map((token) => (
                  <div
                    key={token.tokenSymbol}
                    className="flex justify-between py-2"
                  >
                    <div className="flex space-x-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-base-100 rounded-full">
                        {token.tokenSymbol[0].toUpperCase()}
                      </div>
                      <div>
                        <p>{token.tokenSymbol}</p>
                        <p className="text-[#7D7A9C]">
                          {token.tokenSymbol === "MINA"
                            ? minaDailyPriceDiffText
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p>{formatMina(token.balance.total)}</p>
                      <p className="text-[#7D7A9C]">
                        {token.tokenSymbol === "MINA"
                          ? `$${fiatBalance.toFixed(2)}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-end">
              <h2 className="text-xl">{t("wallet.transactions")}</h2>
              <Link to="/transactions" className="flex items-center mb-[2px]">
                <span>{t("wallet.seeAll")}</span>
                <ArrowRightIcon />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {loading ? (
                <>
                  <Skeleton loading={true} h="145px" />
                  <Skeleton loading={true} h="145px" />
                </>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TxTile
                    key={tx.hash}
                    tx={tx}
                    currentWalletAddress={publicAddress}
                  />
                ))
              ) : (
                <p className="col-span-2">{t("wallet.noTransactionsYet")}</p>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
