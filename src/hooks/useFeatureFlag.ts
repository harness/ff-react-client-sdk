import { FFContext } from '../context/FFContext'
import { useContext } from 'react'

export const useFeatureFlag = (
  flagIdentifier: string,
  defaultValue: any = undefined
) => {
  const { flags } = useContext(FFContext)

  return flagIdentifier in flags ? flags[flagIdentifier] : defaultValue
}
