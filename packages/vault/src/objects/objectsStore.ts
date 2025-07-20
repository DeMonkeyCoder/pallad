import { produce } from "immer"
import { type StateCreator, create } from "zustand"

import { matchesQuery } from "../utils/utils"
import {
  type ObjectStore,
  type StoredObject,
  initialObjectState,
} from "./objectsState"

export const objectSlice: StateCreator<ObjectStore> = (set, get) => ({
  objects: {},
  ensureObject: (credentialId: string) => {
    set(
      produce((draft) => {
        if (!draft.objects[credentialId]) {
          draft.objects[credentialId] = {
            ...(initialObjectState as any),
            credentialId,
          } as any
        }
      }),
    )
  },
  setObject: ({
    credentialId,
    credential,
  }: { credentialId: string; credential: any }) => {
    set(
      produce((draft) => {
        draft.objects[credentialId] = {
          ...(draft.objects[credentialId] as StoredObject),
          ...credential,
          credentialId, // Ensure credentialId is always preserved
        } as any
      }),
    )
  },
  getObject: (credentialId: string) => {
    const { objects } = get()
    return (
      objects[credentialId] ?? {
        ...(initialObjectState as StoredObject),
        credentialId,
      }
    )
  },
  removeObject: (credentialId: string) => {
    set(
      produce((draft) => {
        delete draft.objects[credentialId]
      }),
    )
  },
  searchObjects: ({ query, props }) => {
    const { objects } = get()
    const objectsStatesArray = Object.values(objects).filter((obj) => !!obj)
    const filteredObjects = objectsStatesArray.filter((object) =>
      matchesQuery(object, query),
    )
    if (props?.length) {
      return filteredObjects.flatMap((object) =>
        props
          .filter((prop) => prop in (object as any))
          // @ts-ignore
          .map((prop) => object?.[prop]),
      )
    }
    return filteredObjects
  },
  clearObjects: () => {
    set(
      produce((draft) => {
        draft.objects = {}
      }),
    )
  },
})
export const useObjectVault = create<ObjectStore>()(objectSlice)
