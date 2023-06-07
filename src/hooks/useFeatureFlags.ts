import { FFContext } from '../context/FFContext'
import { useContext, useMemo } from 'react'

export const useFeatureFlags = (
  flagIdentifiers?: Record<string, any> | string[]
): Record<keyof typeof flagIdentifiers, any> => {
  const { client, flags } = useContext(FFContext)

  return useMemo(() => {
    if (!client) {
      return {}
    }

    if (!flagIdentifiers) {
      return Object.fromEntries(
        Object.keys(flags).map((key) => [key, client.variation(key, undefined)])
      )
    }

    if (Array.isArray(flagIdentifiers)) {
      return Object.fromEntries(
        flagIdentifiers.map((flagIdentifier) => [
          flagIdentifier,
          client.variation(flagIdentifier, undefined)
        ])
      )
    } else {
      return Object.fromEntries(
        Object.entries(flagIdentifiers).map(
          ([flagIdentifier, defaultValue]) => [
            flagIdentifier,
            client.variation(flagIdentifier, defaultValue)
          ]
        )
      )
    }
  }, [flags, client, JSON.stringify(flagIdentifiers)])
}
