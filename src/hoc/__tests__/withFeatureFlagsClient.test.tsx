import React, { ComponentType, FC } from 'react'
import { render, RenderResult, screen } from '@testing-library/react'
import { TestWrapper } from '../../test-utils'
import { withFeatureFlagsClient } from '../withFeatureFlagsClient'

const SampleComponent: FC = (props) => (
  <span data-testid="sample-component">{JSON.stringify(props)}</span>
)

const renderComponent = (WrappedComponent: ComponentType): RenderResult =>
  render(<WrappedComponent />, {
    wrapper: ({ children }) => (
      <TestWrapper flags={{ f1: 'f1' }}>{children}</TestWrapper>
    )
  })

describe('withFeatureFlagsClient', () => {
  test('it should add the featureFlagsClient prop to the component', async () => {
    const WrappedComponent = withFeatureFlagsClient(SampleComponent)

    renderComponent(WrappedComponent)

    const el = screen.getByTestId('sample-component')
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent('featureFlagsClient')
  })

  test('it should maintain existing props', async () => {
    const extraProps = { hello: 'world', abc: 123 }
    const WrappedComponent =
      withFeatureFlagsClient<Record<string, any>>(SampleComponent)

    const WrappedComponentWithExtraProps = () => (
      <WrappedComponent {...extraProps} />
    )

    renderComponent(WrappedComponentWithExtraProps)
    const el = screen.getByTestId('sample-component')
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent(
      JSON.stringify({ featureFlagsClient: {}, ...extraProps })
    )
  })
})
