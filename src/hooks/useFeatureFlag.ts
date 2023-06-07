import { FFContext } from '../context/FFContext'
import { useContext } from 'react'

export const useFeatureFlag = (
  flagIdentifier: string,
  defaultValue: any = undefined
) => {
  const { client } = useContext(FFContext)

  if (client) {
    return client.variation(flagIdentifier, defaultValue)
  }

  return defaultValue
}
