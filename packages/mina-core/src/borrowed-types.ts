import type { ZkAppCommandTransactionInput } from "@mina-js/utils"

type SignatureJson = { field: string; scalar: string }

export type UInt32 = number | bigint | string
export type UInt64 = number | bigint | string

export type Field = number | bigint | string

export type PublicKey = string
export type PrivateKey = string
export type Signature = SignatureJson
export type Network = "mainnet" | "testnet"

export type Keypair = {
  readonly privateKey: PrivateKey
  readonly publicKey: PublicKey
}

export type Common = {
  readonly to: PublicKey
  readonly from: PublicKey
  readonly fee: UInt64
  readonly nonce: UInt32
  readonly memo?: string
  readonly validUntil?: UInt32
}
export type StrictCommon = {
  readonly to: string
  readonly from: string
  readonly fee: string
  readonly nonce: string
  readonly memo: string
  readonly validUntil: string
}

export type StakeDelegation = Common
export type Payment = Common & { readonly amount: UInt64 }

export type ZkappCommand = ZkAppCommandTransactionInput

export type SignableData = string | StakeDelegation | Payment

export type SignedLegacy<T> = {
  signature: SignatureJson
  publicKey: PublicKey
  data: T
}
export type Signed<T> = {
  signature: string // base58
  publicKey: PublicKey
  data: T
}

export type SignedAny = SignedLegacy<SignableData> | Signed<ZkappCommand>

export type Group = {
  x: Field
  y: Field
}

export type Nullifier = {
  publicKey: Group
  public: {
    nullifier: Group
    s: Field
  }
  private: {
    c: Field
    g_r: Group
    h_m_pk_r: Group
  }
}
