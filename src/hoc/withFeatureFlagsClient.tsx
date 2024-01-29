import React, { ComponentType } from 'react'
import { FFContextValue } from '../context/FFContext'
import { useFeatureFlagsClient } from '../hooks/useFeatureFlagsClient'

export function withFeatureFlagsClient<C>(
  WrappedComponent: ComponentType<
    C & { featureFlagsClient: FFContextValue['client'] }
  >
) {
  return (props: C) => (
    <WithFeatureFlagsClientComponent
      WrappedComponent={WrappedComponent}
      componentProps={props}
    />
  )
}

function WithFeatureFlagsClientComponent({
  WrappedComponent,
  componentProps
}: {
  WrappedComponent: ComponentType<any>
  componentProps: any
}) {
  const client = useFeatureFlagsClient()

  return <WrappedComponent featureFlagsClient={client} {...componentProps} />
}
