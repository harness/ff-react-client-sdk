import { render, waitFor } from '@testing-library/react'
import { FFContextProvider, FFContextProviderProps } from './FFContext'
import { Event, initialize } from '@harnessio/ff-javascript-client-sdk'

// Mock the FF JS SDK
jest.mock('@harnessio/ff-javascript-client-sdk', () => ({
  initialize: jest.fn(),
  // Mock these so we can manually invoke the callback functions in the tests
  Event: {
    READY: 'ready',
    ERROR_DEFAULT_VARIATION_RETURNED: 'default variation returned',
    ERROR_AUTH: 'auth error'
  }
}))

const mockInitialize = initialize as jest.Mock

describe('FFContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it renders fallback content while loading', async () => {
    mockInitialize.mockReturnValueOnce({
      on: jest.fn(),
      off: jest.fn(),
      close: jest.fn()
    })

    const { getByText } = render(
      <FFContextProvider
        apiKey="test-api-key"
        target={{ identifier: 'test-target' }}
      >
        <p>Loaded</p>
      </FFContextProvider>
    )

    // Initially, it should show the fallback (loading state)
    expect(getByText('Loading...')).toBeInTheDocument()
  })

  test('it updates loading state after SDK is ready', async () => {
    const mockOn = jest.fn()

    mockInitialize.mockReturnValueOnce({
      on: mockOn,
      off: jest.fn(),
      close: jest.fn()
    })

    const { getByText, queryByText } = render(
      <FFContextProvider
        apiKey="test-api-key"
        target={{ identifier: 'test-target' }}
      >
        <p>Loaded</p>
      </FFContextProvider>
    )

    // Simulate the SDK's "ready" event
    const readyCallback = mockOn.mock.calls.find(
      (call) => call[0] === Event.READY
    )?.[1]
    readyCallback?.({})

    // Wait for the component to update after the SDK is ready
    await waitFor(() =>
      expect(queryByText('Loading...')).not.toBeInTheDocument()
    )
    expect(getByText('Loaded')).toBeInTheDocument()
  })

  test('it triggers onFlagNotFound callback when flag is missing with asyncMode disabled', async () => {
    const mockOn = jest.fn()
    const mockOnFlagNotFound = jest.fn()

    mockInitialize.mockReturnValueOnce({
      on: mockOn,
      off: jest.fn(),
      close: jest.fn()
    })

    render(
      <FFContextProvider
        apiKey="test-api-key"
        target={{ identifier: 'test-target' }}
        onFlagNotFound={mockOnFlagNotFound}
        asyncMode={false}
      >
        <p>Loaded</p>
      </FFContextProvider>
    )

    // SDK initialises successfully and emits the ready event
    const readyCallback = mockOn.mock.calls.find(
      (call) => call[0] === Event.READY
    )?.[1]
    readyCallback?.({})

    // Flag can't be found after initialising
    const flagNotFoundCallback = mockOn.mock.calls.find(
      (call) => call[0] === Event.ERROR_DEFAULT_VARIATION_RETURNED
    )?.[1]
    flagNotFoundCallback?.({
      flag: 'missingFlag',
      defaultVariation: 'defaultValue'
    })

    // Verify the onFlagNotFound callback was called after initialization
    await waitFor(() =>
      expect(mockOnFlagNotFound).toHaveBeenCalledWith(
        { flag: 'missingFlag', defaultVariation: 'defaultValue' },
        false
      )
    )
  })

  test('it triggers onFlagNotFound callback when flag is missing with asyncMode enabled', async () => {
    const mockOn = jest.fn()
    const mockOnFlagNotFound = jest.fn()

    mockInitialize.mockReturnValueOnce({
      on: mockOn,
      off: jest.fn(),
      close: jest.fn()
    })

    render(
      <FFContextProvider
        apiKey="test-api-key"
        target={{ identifier: 'test-target' }}
        onFlagNotFound={mockOnFlagNotFound}
        asyncMode={true}
      >
        <p>Loaded</p>
      </FFContextProvider>
    )

    // Flag can't be found as not initialised
    const flagNotFoundCallback = mockOn.mock.calls.find(
      (call) => call[0] === Event.ERROR_DEFAULT_VARIATION_RETURNED
    )?.[1]
    flagNotFoundCallback?.({
      flag: 'missingFlag',
      defaultVariation: 'defaultValue'
    })

    // Verify the onFlagNotFound callback was called immediately and with loading as true
    expect(mockOnFlagNotFound).toHaveBeenCalledWith(
      { flag: 'missingFlag', defaultVariation: 'defaultValue' },
      true
    )

    // SDK initialises successfully,
    const readyCallback = mockOn.mock.calls.find(
      (call) => call[0] === Event.READY
    )?.[1]
    readyCallback?.({})

    // Flag still not found after successful init
    flagNotFoundCallback?.({
      flag: 'missingFlag',
      defaultVariation: 'defaultValue'
    })

    // Verify onFlagNotFound called again, this time with loading as false
    await waitFor(() =>
      expect(mockOnFlagNotFound).toHaveBeenCalledWith(
        { flag: 'missingFlag', defaultVariation: 'defaultValue' },
        false
      )
    )
  })

  test('it triggers onError callback when a network error occurs', async () => {
    const mockOn = jest.fn()
    const mockOnError = jest.fn()

    mockInitialize.mockReturnValueOnce({
      on: mockOn,
      off: jest.fn(),
      close: jest.fn()
    })

    render(
      <FFContextProvider
        apiKey="test-api-key"
        target={{ identifier: 'test-target' }}
        onError={mockOnError}
      >
        <p>Loaded</p>
      </FFContextProvider>
    )

    // SDK fails to init and emits the error event
    const authErrorCallback = mockOn.mock.calls.find(
      (call) => call[0] === Event.ERROR_AUTH
    )?.[1]
    authErrorCallback?.('Auth error message')

    // Verify the onError callback was called
    expect(mockOnError).toHaveBeenCalledWith(
      Event.ERROR_AUTH,
      'Auth error message'
    )
  })
})
