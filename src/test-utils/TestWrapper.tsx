import { FC, PropsWithChildren } from 'react'
import { Result as SDKClient } from '@harnessio/ff-javascript-client-sdk'
import { FFContext } from '../context/FFContext'

const mockVariationFn = jest.fn()

const mockClient: SDKClient = {
  variation: mockVariationFn,
  on: jest.fn(),
  off: jest.fn(),
  close: jest.fn(),
  setEvaluations: jest.fn(),
  registerAPIRequestMiddleware: jest.fn()
}

export interface TestWrapperProps extends PropsWithChildren {
  flags: Record<string, any>
  loading?: boolean
}

export const TestWrapper: FC<TestWrapperProps> = ({
  children,
  loading = false,
  flags
}) => {
  mockVariationFn.mockImplementation((key, defaultVal = undefined) =>
    key in flags ? flags[key] : defaultVal
  )

  return (
    <FFContext.Provider value={{ flags, loading, client: mockClient }}>
      {children}
    </FFContext.Provider>
  )
}
