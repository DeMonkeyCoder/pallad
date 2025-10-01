import type {
  TokenInfo,
  TokenInfoArgs,
  TokenInfoProvider,
} from "@palladco/pallad-core"

import { createGraphQLRequest } from "../utils/fetch-utils"
import { healthCheck } from "../utils/health-check-utils"
import { getTokenInfoQuery } from "./queries"

export const createTokenInfoProvider = (url: string): TokenInfoProvider => {
  const getTokenInfo = async (
    args: TokenInfoArgs,
  ): Promise<Record<string, TokenInfo>> => {
    const query = getTokenInfoQuery(args.tokenIds)
    const fetchGraphQL = createGraphQLRequest(url)
    const result = await fetchGraphQL(query)

    if (!result.ok) {
      throw new Error(result.message)
    }

    return result.data
  }

  return {
    healthCheck: () => healthCheck(url),
    getTokenInfo,
  }
}
