import React, { ComponentType } from 'react'
import { FFContextValue } from '../context/FFContext'
import { useFeatureFlags } from '../hooks/useFeatureFlags'
import { useFeatureFlagsLoading } from '../hooks/useFeatureFlagsLoading'

export function withFeatureFlags<C>(
  WrappedComponent: ComponentType<C & FFContextValue>
) {
  return (props: C) => (
    <WithFeatureFlagsComponent
      WrappedComponent={WrappedComponent}
      componentProps={props}
    />
  )
}

function WithFeatureFlagsComponent({
  WrappedComponent,
  componentProps
}: {
  WrappedComponent: ComponentType<any>
  componentProps: any
}) {
  const flags = useFeatureFlags()
  const loading = useFeatureFlagsLoading()

  return (
    <WrappedComponent flags={flags} loading={loading} {...componentProps} />
  )
}
