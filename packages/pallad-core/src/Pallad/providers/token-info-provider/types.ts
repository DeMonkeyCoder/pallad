import type { Provider } from "../.."

export type TokenInfoArgs = {
  tokenIds: string[]
}

export interface TokenInfo {
  tokenSymbol: string
}

export interface TokenInfoProvider extends Provider {
  /**
   * Gets token info for the tokenIds provided in the arguments
   *
   * @param {string[]} tokenIds - tokenIds
   * @returns {Record<string, TokenInfo>} - An object with token info objects
   */
  getTokenInfo: (args: TokenInfoArgs) => Promise<Record<string, TokenInfo>>
}
