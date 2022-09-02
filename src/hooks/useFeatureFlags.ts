import { FFContext } from '../context/FFContext'
import { useContext } from 'react'
import { FlagIdentifiers, getFlagsSubset } from '../util/getFlagsSubset'

export const useFeatureFlags = (
  flagIdentifiers?: FlagIdentifiers
): Record<keyof typeof flagIdentifiers, any> => {
  const { flags } = useContext(FFContext)

  if (flagIdentifiers) {
    return getFlagsSubset(flags, flagIdentifiers)
  }

  return flags
}
