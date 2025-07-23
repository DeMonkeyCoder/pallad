import type { Json } from "@mina-js/utils"
import { useMemo } from "react"
import { CredentialsView } from "../views/credentials"

export const CredentialsRoute = () => {
  const credentials: [string, Json][] = useMemo(
    () => [
      [
        "jdsiaojdasidj",
        {
          version: "v0",
          witness: {
            type: "native",
            issuer: {
              _type: "PublicKey",
              value: "B62qp6y93m7HztH5jvn12gHJphzAZrZq3daD792hi8a6WSivDS62M6y",
            },
            issuerSignature: {
              _type: "Signature",
              value: {
                r: "18109601711579576077159054874918684240485046670697729886879896112740406317098",
                s: "6142157666787999194289859861812034770345409212996686558675397880877807988196",
              },
            },
          },
          credential: {
            owner: {
              _type: "PublicKey",
              value: "B62qoYJCCwNSGRw73ww5eNCZnKCvjoEtrqr9UxuLnVHamDBEwSXjaw3",
            },
            data: {
              nationality: "Nanayourbusnis",
              name: "maaaaaaa",
              birthDate: {
                _type: "Int64",
                value: { magnitude: "655344000000", sgn: "Positive" },
              },
              id: {
                _type: "Bytes",
                size: 16,
                value: "681e7f09b102c1e7d5c74d1e85c5db0a",
              },
              expiresAt: { _type: "UInt64", value: "1777727336607" },
            },
          },
        },
      ],
    ],
    [],
  )
  return <CredentialsView credentials={credentials} />
}
