import React, { ComponentType } from 'react'
import { ifFeatureFlag } from '../ifFeatureFlag'
import { render, RenderResult, screen } from '@testing-library/react'
import { FFContextValue } from '../../context/FFContext'
import { TestWrapper } from '../../test-utils/TestWrapper'

const SampleComponent = () => (
  <span data-testid="sample-component">Sample Component</span>
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

describe('ifFeatureFlag', () => {
  test('it should render if the condition matches', async () => {
    const WrappedComponent = ifFeatureFlag('myFlag', { matchValue: true })(
      SampleComponent
    )

    renderComponent(WrappedComponent, { myFlag: true })

    expect(screen.getByTestId('sample-component')).toBeInTheDocument()
  })

  test('it should not render if the condition does not match', async () => {
    const WrappedComponent = ifFeatureFlag('myFlag', { matchValue: 123 })(
      SampleComponent
    )

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

  test('it should display nothing if loading and no loadingFallback provided', async () => {
    const WrappedComponent = ifFeatureFlag('myFlag')(SampleComponent)

    renderComponent(WrappedComponent, { myFlag: true }, true)

    expect(screen.queryByTestId('sample-component')).not.toBeInTheDocument()
  })

  test('it should display the loadingFallback when loading', async () => {
    const loadingFallback = (
      <span data-testid="loading-fallback">Loading...</span>
    )
    const WrappedComponent = ifFeatureFlag('myFlag', { loadingFallback })(
      SampleComponent
    )

    renderComponent(WrappedComponent, { myFlag: true }, true)

    expect(screen.queryByTestId('sample-component')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading-fallback')).toBeInTheDocument()
  })
})
