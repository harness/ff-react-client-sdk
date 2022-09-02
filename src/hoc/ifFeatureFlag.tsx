import React, { ComponentType } from 'react'
import { FFContext } from '../context/FFContext'

export function ifFeatureFlag<C>(flagName: string, value?: any) {
  return function ifFeatureFlagHoc(WrappedComponent: ComponentType<C>) {
    return (props: C) => (
      <FFContext.Consumer>
        {({ flags }) => {
          const flagValue = flags?.[flagName]

          if (
            (value === flagValue && flagName in flags) ||
            (value === undefined && !!flagValue)
          ) {
            return <WrappedComponent {...props} />
          }

          return null
        }}
      </FFContext.Consumer>
    )
  }
}
