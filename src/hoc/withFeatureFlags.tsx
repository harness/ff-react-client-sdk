import React, { ComponentType } from 'react'
import { FFContext, FFContextValue } from '../context/FFContext'

interface WrappedComponentType {
  flags: FFContextValue['flags']
}

export function withFeatureFlags<C>(
  WrappedComponent: ComponentType<C & WrappedComponentType>
) {
  return (props: C) => (
    <FFContext.Consumer>
      {({ flags }) => <WrappedComponent flags={flags} {...props} />}
    </FFContext.Consumer>
  )
}
