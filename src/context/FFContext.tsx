import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState
} from 'react'
import {
  Evaluation,
  Event as FFEvent,
  initialize,
  Options,
  Target
} from '@harnessio/ff-javascript-client-sdk'
import omit from 'lodash.omit'

export interface FFContextValue {
  loading: boolean
  flags: Record<string, any>
}

export const FFContext = createContext<FFContextValue>({} as FFContextValue)

interface FFContextProviderProps extends PropsWithChildren {
  apiKey: string
  target: Target
  options?: Options
  fallback?: ReactNode
  async?: boolean
}

export const FFContextProvider: FC<FFContextProviderProps> = ({
  children,
  apiKey,
  target,
  options = {},
  fallback = <p>Loading...</p>,
  async = false
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [flags, setFlags] = useState<FFContextValue['flags']>({})

  useEffect(() => {
    if (apiKey && target) {
      const client = initialize(apiKey, target, options)

      setLoading(true)

      const onInitialLoad = (newFlags: FFContextValue['flags']): void => {
        setLoading(false)
        setFlags(newFlags)
      }

      const onFlagChange = ({ deleted, flag, value }: Evaluation): void => {
        if (deleted) {
          setFlags((currentFlags) => omit(currentFlags, flag))
        } else {
          setFlags((currentFlags) => ({
            ...currentFlags,
            [flag]: value
          }))
        }
      }

      client.on(FFEvent.READY, onInitialLoad)
      client.on(FFEvent.CHANGED, onFlagChange)

      return () => {
        client.off(FFEvent.READY, onInitialLoad)
        client.off(FFEvent.CHANGED, onFlagChange)

        client.on(FFEvent.READY, client.close)
        client.on(FFEvent.CONNECTED, client.close)
      }
    }
  }, [apiKey, JSON.stringify(target)])

  return (
    <FFContext.Provider value={{ loading, flags }}>
      {!async && loading ? fallback : children}
    </FFContext.Provider>
  )
}
