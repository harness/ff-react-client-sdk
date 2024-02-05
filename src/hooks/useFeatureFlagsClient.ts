import { FFContext, FFContextValue } from '../context/FFContext'
import { useContext } from 'react'

export const useFeatureFlagsClient = (): FFContextValue['client'] => {
  const { client } = useContext(FFContext)

  return client
}
