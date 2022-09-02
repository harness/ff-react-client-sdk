import React, { ComponentType, createContext } from 'react'
import { ifFeatureFlag } from '../ifFeatureFlag'
import { render, RenderResult, screen } from '@testing-library/react'
import { FFContext, FFContextValue } from '../../context/FFContext'

jest.mock('../../context/FFContext', () => ({
  FFContext: createContext({ flags: {} })
}))

const SampleComponent = () => (
  <span data-testid="sample-component">Sample Component</span>
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

describe('ifFeatureFlag', () => {
  test('it should render if the condition matches', async () => {
    const WrappedComponent = ifFeatureFlag('myFlag', true)(SampleComponent)

    renderComponent(WrappedComponent, { myFlag: true })

    expect(screen.getByTestId('sample-component')).toBeInTheDocument()
  })

  test('it should not render if the condition does not match', async () => {
    const WrappedComponent = ifFeatureFlag('myFlag', 123)(SampleComponent)

    renderComponent(WrappedComponent, { myFlag: 'abc' })

    expect(screen.queryByTestId('sample-component')).not.toBeInTheDocument()
  })

  test('it should render if the condition is not set and the flag is truthy', async () => {
    const WrappedComponent = ifFeatureFlag('myFlag')(SampleComponent)

    renderComponent(WrappedComponent, { myFlag: 1234 })

    expect(screen.getByTestId('sample-component')).toBeInTheDocument()
  })

  test('it should not render if the condition is not set and the flag is falsy', async () => {
    const WrappedComponent = ifFeatureFlag('myFlag')(SampleComponent)

    renderComponent(WrappedComponent, { myFlag: 0 })

    expect(screen.queryByTestId('sample-component')).not.toBeInTheDocument()
  })

  test('it should not render if the condition is not set and the flag does not exist', async () => {
    const WrappedComponent = ifFeatureFlag('myFlag')(SampleComponent)

    renderComponent(WrappedComponent)

    expect(screen.queryByTestId('sample-component')).not.toBeInTheDocument()
  })
})
