export function getTokenInfoQuery(tokenIds: string[]): string {
  return `query {
    ${tokenIds.map(
      (tokenId) => `${tokenId}: tokenOwner(tokenId: "${tokenId}") {
      tokenSymbol
    }
    `,
    )}
  }`
}
