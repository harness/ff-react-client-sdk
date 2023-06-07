import { FFContext } from '../context/FFContext'
import { useContext } from 'react'

export const useFeatureFlagsLoading = (): boolean => {
  const { loading } = useContext(FFContext)

  return loading
}
