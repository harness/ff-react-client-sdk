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
        {({ flags, loading }) => {
          if (loading) {
            return loadingFallback
          }

          const flagValue = flags?.[flagName]

          if (
            (matchValue === flagValue && flagName in flags) ||
            (matchValue === undefined && !!flagValue)
          ) {
            return <WrappedComponent {...props} />
          }

          return null
        }}
      </FFContext.Consumer>
    )
  }
}
