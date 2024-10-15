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
  Result as InitializeResult,
  Target, VariationValue
} from '@harnessio/ff-javascript-client-sdk'
import omit from 'lodash.omit'
import type {DefaultVariationEventPayload} from "../../../ff-javascript-client-sdk/src/types";

export interface FFContextValue {
  loading: boolean
  flags: Record<string, any>
  client?: InitializeResult
}

export const FFContext = createContext<FFContextValue>({} as FFContextValue)

export type NetworkError =
  | FFEvent.ERROR_AUTH
  | FFEvent.ERROR_STREAM
  | FFEvent.ERROR_FETCH_FLAG
  | FFEvent.ERROR_FETCH_FLAGS
  | FFEvent.ERROR_METRICS

export interface FFContextProviderProps extends PropsWithChildren {
  apiKey: string
  target: Target
  options?: Options
  fallback?: ReactNode
  async?: boolean
  initialEvaluations?: Evaluation[]
  onError?: (event: NetworkError | 'PropsError', error?: unknown) => void
  onFlagNotFound?: (flagNotFound: DefaultVariationEventPayload, loading: boolean) => void
}

export const FFContextProvider: FC<FFContextProviderProps> = ({
  children,
  apiKey,
  target,
  options = {},
  fallback = <p>Loading...</p>,
  async = false,
  initialEvaluations,
  onError = () => void 0,
  onFlagNotFound = () => void 0
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [flags, setFlags] = useState<FFContextValue['flags']>({})
  const [clientInstance, setClientInstance] =
    useState<FFContextValue['client']>()

  useEffect(() => {
    if (!apiKey) {
      console.error('[FF-SDK] apiKey prop is required')
      onError('PropsError', { message: 'apiKey prop is required' })
    }
  }, [apiKey])

  useEffect(() => {
    if (!target?.identifier) {
      console.error('[FF-SDK] target prop is required')
      onError('PropsError', { message: 'target prop is required' })
    }
  }, [target?.identifier])

  useEffect(() => {
    if (apiKey && target?.identifier) {
      const client = initialize(apiKey, target, options)

      setLoading(true)
      setClientInstance(client)

      const onInitialLoad = (newFlags: FFContextValue['flags']): void => {
        setLoading(false)
        setFlags(newFlags)

        client.on(FFEvent.CHANGED, onFlagChange)
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

      const onNetworkError = (errorType: NetworkError) => (e: unknown) => {
        onError(errorType, e)
      }

      const onFlagNotFoundListener = ({ flag, defaultVariation }: DefaultVariationEventPayload) => {
        onFlagNotFound({ flag, defaultVariation }, loading)
      }

      const onAuthError = onNetworkError(FFEvent.ERROR_AUTH)
      const onStreamError = onNetworkError(FFEvent.ERROR_STREAM)
      const onFetchFlagError = onNetworkError(FFEvent.ERROR_FETCH_FLAG)
      const onFetchFlagsError = onNetworkError(FFEvent.ERROR_FETCH_FLAGS)
      const onMetricsError = onNetworkError(FFEvent.ERROR_METRICS)

      client.on(FFEvent.READY, onInitialLoad)
      client.on(FFEvent.ERROR_AUTH, onAuthError)
      client.on(FFEvent.ERROR_STREAM, onStreamError)
      client.on(FFEvent.ERROR_FETCH_FLAG, onFetchFlagError)
      client.on(FFEvent.ERROR_FETCH_FLAGS, onFetchFlagsError)
      client.on(FFEvent.ERROR_METRICS, onMetricsError)
      client.on(FFEvent.ERROR_DEFAULT_VARIATION_RETURNED, onFlagNotFoundListener)

      if (initialEvaluations) {
        client.setEvaluations(initialEvaluations)
      }

      return () => {
        client.off(FFEvent.READY, onInitialLoad)
        client.off(FFEvent.CHANGED, onFlagChange)
        client.off(FFEvent.ERROR_AUTH, onAuthError)
        client.off(FFEvent.ERROR_STREAM, onStreamError)
        client.off(FFEvent.ERROR_FETCH_FLAG, onFetchFlagError)
        client.off(FFEvent.ERROR_FETCH_FLAGS, onFetchFlagsError)
        client.off(FFEvent.ERROR_METRICS, onMetricsError)
        client.off(FFEvent.ERROR_DEFAULT_VARIATION_RETURNED, onFlagNotFoundListener)

        client.close()
      }
    }
  }, [apiKey, JSON.stringify(target), initialEvaluations])

  return (
    <FFContext.Provider value={{ loading, flags, client: clientInstance }}>
      {!async && loading ? fallback : children}
    </FFContext.Provider>
  )
}
