import type { FFContextValue } from '../context/FFContext'

export type FlagIdentifiers = Record<string, any> | string[]

export function getFlagsSubset(
  flags: FFContextValue['flags'],
  flagIdentifiers: FlagIdentifiers
) {
  const flagDefaultMap = Array.isArray(flagIdentifiers)
    ? flagIdentifiers.reduce(
        (map, flagIdentifier) => ({
          ...map,
          [flagIdentifier]: undefined
        }),
        {}
      )
    : flagIdentifiers

  return {
    ...flagDefaultMap,
    ...Object.fromEntries(
      Object.entries(flags).filter(
        ([flagIdentifier]) => flagIdentifier in flagDefaultMap
      )
    )
  }
}
