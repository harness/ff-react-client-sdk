import React, { ComponentType, createContext, FC } from 'react'
import { render, RenderResult, screen } from '@testing-library/react'
import { FFContext, FFContextValue } from '../../context/FFContext'
import { withFeatureFlags } from '../withFeatureFlags'

jest.mock('../../context/FFContext', () => ({
  FFContext: createContext({ flags: {} })
}))

const SampleComponent: FC = (props) => (
  <span data-testid="sample-component">{JSON.stringify(props)}</span>
)

const renderComponent = (
  WrappedComponent: ComponentType,
  flags: FFContextValue['flags'] = {}
): RenderResult =>
  render(<WrappedComponent />, {
    wrapper: ({ children }) => (
      <FFContext.Provider value={{ flags, loading: false }}>
        {children}
      </FFContext.Provider>
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
    expect(el).toHaveTextContent(JSON.stringify({ flags, ...extraProps }))
  })
})
