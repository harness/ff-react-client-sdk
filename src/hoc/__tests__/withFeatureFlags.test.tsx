import React, { ComponentType, FC } from 'react'
import { render, RenderResult, screen } from '@testing-library/react'
import { FFContextValue } from '../../context/FFContext'
import { withFeatureFlags } from '../withFeatureFlags'
import { TestWrapper } from '../../test-utils'

const SampleComponent: FC = (props) => (
  <span data-testid="sample-component">{JSON.stringify(props)}</span>
)

const renderComponent = (
  WrappedComponent: ComponentType,
  flags: FFContextValue['flags'] = {},
  loading: boolean = false
): RenderResult =>
  render(<WrappedComponent />, {
    wrapper: ({ children }) => (
      <TestWrapper flags={flags} loading={loading}>
        {children}
      </TestWrapper>
    )
  })

describe('withFeatureFlags', () => {
  test('it should add the flags prop to the component', async () => {
    const flags = { f1: 'f1', f2: 'f2' }
    const WrappedComponent = withFeatureFlags(SampleComponent)

    renderComponent(WrappedComponent, flags)

    const el = screen.getByTestId('sample-component')
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent(JSON.stringify(flags))
  })

  test('it should maintain existing props', async () => {
    const flags = { f1: 'f1' }
    const extraProps = { hello: 'world', abc: 123 }
    const WrappedComponent =
      withFeatureFlags<Record<string, any>>(SampleComponent)

    const WrappedComponentWithExtraProps = () => (
      <WrappedComponent {...extraProps} />
    )

    renderComponent(WrappedComponentWithExtraProps, flags)
    const el = screen.getByTestId('sample-component')
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent(
      JSON.stringify({ flags, loading: false, ...extraProps })
    )
  })

  test('it should pass the loading prop to the component', async () => {
    const flags = {}
    const WrappedComponent = withFeatureFlags(SampleComponent)

    renderComponent(WrappedComponent, flags, true)

    const el = screen.getByTestId('sample-component')
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent(JSON.stringify({ flags, loading: true }))
  })
})
