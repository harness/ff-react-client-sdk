# React.js Client SDK For Harness Feature Flags

[![React version][react-badge]][reactjs]
[![TypeScript version][ts-badge]][typescript-4-7]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]

Use this README to get started with our Feature Flags (FF) Client SDK for React. This guide outlines the basics of
getting started with the SDK and provides a full code sample for you to try out.

This sample doesn't include configuration options, for in depth steps and configuring the SDK, see
the [React Client SDK Reference](https://developer.harness.io/docs/feature-flags/ff-sdks/client-sdks/react-client).

## Requirements

To use this SDK, make sure you’ve:

- Installed Node.js v12 or a newer version
- Installed React.js v16.7 or a newer version

To follow along with our test code sample, make sure you’ve:

- [Created a Feature Flag on the Harness Platform](https://developer.harness.io/docs/feature-flags/ff-creating-flag/create-a-feature-flag/)
  called `harnessappdemodarkmode`
- [Created a client SDK key](https://developer.harness.io/docs/feature-flags/ff-creating-flag/create-a-project#create-an-sdk-key)
  and made a copy of it

## Installing the SDK

The first step is to install the FF SDK as a dependency in your application. To install using npm, use:

```shell
npm install @harnessio/ff-react-client-sdk
```

Or to install with yarn, use:

```shell
yarn add @harnessio/ff-react-client-sdk
```

## Code Sample

The following is a complete code example that you can use to test the `harnessappdemodarkmode` Flag you created on the
Harness Platform. When you run the code it will:

- Render a loading screen
- Connect to the FF service
- Retrieve all flags
- Access a flag using the `useFeatureFlag` hook
- Access several flags using the `useFeatureFlags` hook

```typescript jsx
import React from 'react'
import ReactDOM from 'react-dom'

import {
  FFContextProvider,
  useFeatureFlag,
  useFeatureFlags
} from '@harnessio/ff-react-client-sdk'

ReactDOM.render(<App />, document.querySelector('#react-root'))

function App() {
  return (
    <FFContextProvider
      apiKey="YOUR_API_KEY"
      target={{
        identifier: 'reactclientsdk',
        name: 'ReactClientSDK'
      }}
    >
      <SingleFeatureFlag />
      <MultipleFeatureFlags />
    </FFContextProvider>
  )
}

function SingleFeatureFlag() {
  const flagValue = useFeatureFlag('harnessappdemodarkmode')

  return (
    <p>The value of "harnessappdemodarkmode" is {JSON.stringify(flagValue)}</p>
  )
}

function MultipleFeatureFlags() {
  const flags = useFeatureFlags()

  return (
    <>
      <p>Here are all our flags:</p>
      <pre>{JSON.stringify(flags, null, 2)}</pre>
    </>
  )
}
```

## Async mode

By default, the React Client SDK will block rendering of children until the initial load of Feature Flags has completed.
This ensures that children have immediate access to all Flags when they are rendered. However, in some circumstances it
may be beneficial to immediately render the application and handle display of loading on a component-by-component basis.
The React Client SDK's asynchronous mode allows this by passing the optional `async` prop when connecting with the
`FFContextProvider`.

## Caching evaluations

In practice flags rarely change and so it can be useful to cache the last received evaluations from the server to allow
your application to get started as fast as possible. Setting the `cache` option as `true` or as an object (see interface
below) will allow the SDK to store its evaluations to `localStorage` and retrieve at startup. This lets the SDK get
started near instantly and begin serving flags, while it carries on authenticating and fetching up-to-date evaluations
from the server behind the scenes.

```typescript jsx
<FFContextProvider
  apiKey="YOUR_API_KEY"
  target={{
    identifier: 'reactclientsdk',
    name: 'ReactClientSDK'
  }}
  options={{
    cache: true
  }}
>
  <MyApp />
</FFContextProvider>
```

The `cache` option can also be passed as an object with the following options.

```typescript
interface CacheOptions {
  // maximum age of stored cache, in ms, before it is considered stale
  ttl?: number
  // storage mechanism to use, conforming to the Web Storage API standard, can be either synchronous or asynchronous
  // defaults to localStorage
  storage?: AsyncStorage | SyncStorage
}

interface SyncStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

interface AsyncStorage {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}
```

## Overriding the internal logger

By default, the React Client SDK will log errors and debug messages using the `console` object. In some cases, it
can be useful to instead log to a service or silently fail without logging errors.

```typescript jsx
const myLogger = {
  debug: (...data) => {
    // do something with the logged debug message
  },
  info: (...data) => {
    // do something with the logged info message
  },
  error: (...data) => {
    // do something with the logged error message
  },
  warn: (...data) => {
    // do something with the logged warning message
  }
}

return (
  <FFContextProvider
    apiKey="YOUR_API_KEY"
    target={{
      identifier: 'reactclientsdk',
      name: 'ReactClientSDK'
    }}
    options={{
      logger: myLogger
    }}
  >
    <MyApp />
  </FFContextProvider>
)
```

## API

### `FFContextProvider`

The `FFContextProvider` component is used to set up the React context to allow your application to access Feature Flags
using the `useFeatureFlag` and `useFeatureFlags` hooks and `withFeatureFlags`
[HOC](https://reactjs.org/docs/higher-order-components.html). At minimum, it requires the `apiKey` you have set up in
your Harness Feature Flags account, and the `target`. You can think of a `target` as a user.

The `FFContextProvider` component also accepts an `options` object, a `fallback` component, an array
of `initialEvaluations`, an `onError` handler, and can be placed in [Async mode](#Async-mode) using the `async` prop.
The `fallback` component will be displayed while the SDK is connecting and fetching your flags. The `initialEvaluations`
prop allows you pass an array of evaluations to use immediately as the SDK is authenticating and fetching flags.
The `onError` prop allows you to pass an event handler which will be called whenever a network error occurs.

```typescript jsx
import { FFContextProvider } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  return (
    <FFContextProvider
      async={false} // OPTIONAL: whether or not to use async mode
      apiKey="YOUR_API_KEY" // your SDK API key
      target={{
        identifier: 'targetId', // unique ID of the Target
        name: 'Target Name',  // name of the Target
        attributes: { // OPTIONAL: key/value pairs of attributes of the Target
          customAttribute: 'this is a custom attribute',
          anotherCustomAttribute: 'this is something else'
        }
      }}
      fallback={<p>Loading ...</p>} // OPTIONAL: component to display when the SDK is connecting
      options={{ // OPTIONAL: advanced configuration options
        cache: false,
        baseUrl: 'https://url-to-access-flags.com',
        eventUrl: 'https://url-for-events.com',
        streamEnabled: true,
        debug: true,
        eventsSyncInterval: 60000
      }}
      initialEvaluations={evals} // OPTIONAL: array of evaluations to use while fetching
      onError={handler} // OPTIONAL: event handler to be called on network error
    >
      <CompontToDisplayAfterLoad /> <!-- component to display when Flags are available -->
    </FFContextProvider>
  )
}
```

### `useFeatureFlag`

The `useFeatureFlag` hook returns a single named flag value. An optional second argument allows you to set what value
will be returned if the flag does not have a value. By default `useFeatureFlag` will return `undefined` if the flag
cannot be found.

> N.B. when rendered in [Async mode](#Async-mode), the default value will be returned until the Flags are retrieved.
> Consider using the [useFeatureFlagsLoading hook](#usefeatureflagsloading) to determine when the SDK has finished
> loading.

```typescript jsx
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  const myFlagValue = useFeatureFlag('flagIdentifier', 'default value')

  return <p>My flag value is: {myFlagValue}</p>
}
```

### `useFeatureFlags`

The `useFeatureFlags` hook returns an object of Flag identifier/Flag value pairs. You can pass an array of Flag
identifiers or an object of Flag identifier/default value pairs. If an array is used and a Flag cannot be found, the
returned value for the flag will be `undefined`. If no arguments are passed, all Flags will be returned.

> N.B. when rendered in [Async mode](#Async-mode), the default value will be returned until the Flags are retrieved.
> Consider using the [useFeatureFlagsLoading hook](#usefeatureflagsloading) to determine when the SDK has finished
> loading.

```typescript jsx
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  const myFlagValues = useFeatureFlags()

  return (
    <>
      <p>My flag values are:</p>
      <pre>{JSON.stringify(myFlagValues, null, 2)}</pre>
    </>
  )
}
```

#### Get a subset of Flags

```typescript jsx
const myFlagValues = useFeatureFlags(['flag1', 'flag2'])
```

#### Get a subset of Flags with custom default values

```typescript jsx
const myFlagValues = useFeatureFlags({
  flag1: 'defaultForFlag1',
  flag2: 'defaultForFlag2'
})
```

### `useFeatureFlagsLoading`

The `useFeatureFlagsLoading` hook returns a boolean value indicating whether the SDK is currently loading Flags
from the server.

```typescript jsx
import {
  useFeatureFlagsLoading,
  useFeatureFlags
} from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  const isLoading = useFeatureFlagsLoading()
  const flags = useFeatureFlags()

  if (isLoading) {
    return <p>Loading ...</p>
  }

  return (
    <>
      <p>My flag values are:</p>
      <pre>{JSON.stringify(flags, null, 2)}</pre>
    </>
  )
}
```

### `useFeatureFlagsClient`

The React Client SDK internally uses the Javascript Client SDK to communicate with Harness. Sometimes it might be useful
to be able to access the instance of the Javascript Client SDK rather than use the existing hooks or higher-order
components (HOCs). The `useFeatureFlagsClient` hook returns the current Javascript Client SDK instance that the React
Client SDK is using. This instance will be configured, initialized and have been hooked up to the various events the
Javascript Client SDK provides.

```typescript jsx
import {
  useFeatureFlagsClient,
  useFeatureFlagsLoading
} from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  const client = useFeatureFlagsClient()
  const loading = useFeatureFlagsLoading()

  if (loading || !client) {
    return <p>Loading...</p>
  }

  return (
    <p>
      My flag value is: {client.variation('flagIdentifier', 'default value')}
    </p>
  )
}
```

### `ifFeatureFlag`

The `ifFeatureFlag` higher-order component (HOC) wraps your component and conditionally renders only when the named flag
is enabled or matches a specific value.

```typescript jsx
import { ifFeatureFlag } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  return <p>This should render if the flag is on</p>
}

const MyConditionalComponent = ifFeatureFlag('flag1')(MyComponent)
```

You can then use `MyConditionalComponent` as a normal component, and only render if `flag1`'s value is truthy.

#### Conditionally with a specific value

```typescript jsx
import { ifFeatureFlag } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  return <p>This should render if the flag evaluates to 'ABC123'</p>
}

const MyConditionalComponent = ifFeatureFlag('flag1', { matchValue: 'ABC123' })(
  MyComponent
)
```

You can then use `MyConditionalComponent` as a normal component, only render if `flag1`'s value matches the passed
condition.

#### Loading fallback when in async mode

If [Async mode](#Async-mode) is used, by default the component will wait for Flags to be retrieved before showing. This
behaviour can be overridden by passing an element as `loadingFallback`; when loading the `loadingFallback` will be
displayed until the Flags are retrieved, at which point the component will either show or hide as normal.

```typescript jsx
import { ifFeatureFlag } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  return <p>This should render if the flag is on</p>
}

const MyConditionalComponent = ifFeatureFlag('flag1', {
  loadingFallback: <p>Loading...</p>
})(MyComponent)
```

### `withFeatureFlags`

The `withFeatureFlags` higher-order component (HOC) wraps your component and adds `flags` and `loading` as additional
props. `flags` contains the evaluations for all known flags and `loading` indicates whether the SDK is actively fetching
Flags.

```typescript jsx
import { withFeatureFlags } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent({ flags }) {
  return <p>Flag1's value is {flags.flag1}</p>
}

const MyComponentWithFlags = withFeatureFlags(MyComponent)
```

#### Loading in async mode

If [Async mode](#Async-mode) is used, the `loading` prop will indicate whether the SDK has completed loading the Flags.
When loading completes, the `loading` prop will be `false` and the `flags` prop will contain all known Flags.

```typescript jsx
import { withFeatureFlags } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent({ flags, loading }) {
  if (loading) {
    return <p>Loading...</p>
  }

  return <p>Flag1's value is {flags.flag1}</p>
}

const MyComponentWithFlags = withFeatureFlags(MyComponent)
```

### `withFeatureFlagsClient`

The React Client SDK internally uses the Javascript Client SDK to communicate with Harness. Sometimes it might be useful
to be able to access the instance of the Javascript Client SDK rather than use the existing hooks or higher-order
components (HOCs). The `withFeatureFlagsClient` HOC wraps your component and adds `featureFlagsClient` as additional
prop. `featureFlagsClient` is the current Javascript Client SDK instance that the React Client SDK is using. This
instance will be configured, initialized and have been hooked up to the various events the Javascript Client SDK
provides.

```typescript jsx
import { withFeatureFlagsClient } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent({ featureFlagsClient }) {
  if (featureFlagsClient) {
    return (
      <p>
        Flag1's value is {featureFlagsClient.variation('flag1', 'no value')}
      </p>
    )
  }

  return <p>The Feature Flags client is not currently available</p>
}

const MyComponentWithClient = withFeatureFlagsClient(MyComponent)
```

## Testing with Jest

When running tests with Jest, you may want to mock the SDK to avoid making network requests. You can do this by using
the included `TestWrapper` component. This component accepts a listing of flags and their values, and will mock the SDK
to return those values. In the example below, we use Testing Library to render the component `<MyComponent />` that
internally uses the `useFeatureFlag` hook.

> N.B. to use the `TestWrapper` component, you must import it from the `dist/cjs/test-utils` directory, not from the
> main package.

```typescript jsx
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '@harnessio/ff-react-client-sdk/dist/cjs/test-utils'

// ...

test('it should render the flag value', () => {
  render(
    <TestWrapper flags={{ flag1: 'value1', flag2: 'value2' }}>
      <MyComponent />
    </TestWrapper>
  )

  expect(screen.getByText('value1')).toBeInTheDocument()
})
```

## Additional Reading

For further examples and config options, see
the [React.js Client SDK Reference](https://developer.harness.io/docs/feature-flags/ff-sdks/client-sdks/react-client)
For more information about Feature Flags, see
our [Feature Flags documentation](https://developer.harness.io/docs/feature-flags/ff-onboarding/getting-started-with-feature-flags/).

[ts-badge]: https://img.shields.io/badge/TypeScript-4.7-blue.svg
[react-badge]: https://img.shields.io/badge/React.js->=%2016.7-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2012-blue.svg
[nodejs]: https://nodejs.org/dist/latest/docs/api/
[reactjs]: https://reactjs.org
[typescript-4-7]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/drone/ff-nodejs-server-sdk/blob/main/LICENSE
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
