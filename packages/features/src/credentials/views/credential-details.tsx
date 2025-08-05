import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { useTranslation } from "react-i18next"

export type CredentialDetailsViewProps = {
  id: string
  credential: string
  onGoBack: () => void
  onDelete: () => void
}

export const CredentialDetailsView = ({
  id,
  credential,
  onGoBack,
  onDelete,
}: CredentialDetailsViewProps) => {
  const { t } = useTranslation()
  return (
    <AppLayout className="h-screen">
      <section className="flex flex-col justify-between w-full h-full pb-8">
        <MenuBar variant="back" onBackClicked={onGoBack} />
        <h1 className="text-3xl w-full px-8">{id}</h1>
        <div className="break-all flex-1 p-4 bg-secondary rounded-xl whitespace-pre-wrap overflow-y-auto mx-8 mt-8">
          {credential}
        </div>
        <div className="px-8 pt-8 w-full max-w-md self-center">
          <button
            type="button"
            className="btn btn-error w-full"
            onClick={onDelete}
          >
            {t("credentials.delete")}
          </button>
        </div>
      </section>
    </AppLayout>
  )
}
