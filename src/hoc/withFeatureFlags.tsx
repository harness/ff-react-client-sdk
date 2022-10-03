import React, { ComponentType } from 'react'
import { FFContext, FFContextValue } from '../context/FFContext'

export function withFeatureFlags<C>(
  WrappedComponent: ComponentType<C & FFContextValue>
) {
  return (props: C) => (
    <FFContext.Consumer>
      {({ flags, loading }) => (
        <WrappedComponent flags={flags} loading={loading} {...props} />
      )}
    </FFContext.Consumer>
  )
}
