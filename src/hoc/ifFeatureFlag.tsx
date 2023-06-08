import React, { ComponentType, ReactNode } from 'react'
import { FFContext } from '../context/FFContext'

export interface IfFeatureFlagOptions {
  matchValue?: unknown
  loadingFallback?: ReactNode
}

export function ifFeatureFlag<C>(
  flagName: string,
  { matchValue = undefined, loadingFallback = null }: IfFeatureFlagOptions = {}
) {
  return function ifFeatureFlagHoc(WrappedComponent: ComponentType<C>) {
    return (props: C) => (
      <FFContext.Consumer>
        {({ client, loading }) => {
          if (loading) {
            return loadingFallback
          }

          const internalNoValue = 'FF_SDK_INTERNAL_NO_VALUE'
          const flagValue = client?.variation(flagName, internalNoValue)

          if (
            matchValue === flagValue ||
            (matchValue === undefined &&
              flagValue !== internalNoValue &&
              !!flagValue)
          ) {
            return <WrappedComponent {...props} />
          }

          return null
        }}
      </FFContext.Consumer>
    )
  }
}
