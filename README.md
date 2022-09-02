# React.js Client SDK For Harness Feature Flags

[![React version][react-badge]][reactjs]
[![TypeScript version][ts-badge]][typescript-4-7]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]

Use this README to get started with our Feature Flags (FF) Client SDK for React.js. This guide outlines the basics of
getting started with the SDK and provides a full code sample for you to try out.

This sample doesn't include configuration options, for in depth steps and configuring the SDK, see
the [JavaScript Client SDK Reference](https://docs.harness.io/article/bmlvsxhp13-java-script-sdk-references).

## Requirements

To use this SDK, make sure you’ve:

- Installed Node.js v12 or a newer version
- Installed React.js v16.7 or a newer version

To follow along with our test code sample, make sure you’ve:

- [Created a Feature Flag on the Harness Platform](https://docs.harness.io/article/1j7pdkqh7j-create-a-feature-flag)
  called `harnessappdemodarkmode`
- [Created a client SDK key](https://docs.harness.io/article/1j7pdkqh7j-create-a-feature-flag#step_3_create_an_sdk_key)
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
    <p>
      The "harnessappdemodarkmode" flag's value is {JSON.stringify(flagValue)}
    </p>
  )
}

function MultipleFeatureFlags() {
  const flags = useFeatureFlags()

  return (
    <>
      <p>Here's all our flags:</p>
      <pre>{JSON.stringify(flags, null, 2)}</pre>
    </>
  )
}
```

## API

### `FFContextProvider`

The `FFContextProvider` component is used to set up the React context to allow your application to access Feature Flags
using the `useFeatureFlag` and `useFeatureFlags` hooks. At minimum, it requires the `apiKey` you have set up in your
Harness Feature Flags account, and the `target`. You can think of a `target` as a user.

The `FFContextProvider` component also accepts an `options` object and a `fallback` component. The `fallback` component
will be displayed while the SDK is connecting and fetching your flags.

```typescript jsx
import { FFContextProvider } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  return (
    <FFContextProvider
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
      options={{ // OPTIONAL: advanced options
        baseUrl: 'https://url-to-access-flags.com',
        eventUrl: 'https://url-for-events.com',
        streamEnabled: true,
        allAttributesPrivate: false,
        privateAttributeNames: ['customAttribute'],
        debug: true
      }}
    >
      <CompontToDisplayAfterLoad /> <!-- component to display when Flags are available -->
    < /FFContextProvider>
  )
}
```

### `useFeatureFlag`

The `useFeatureFlag` hook returns a single named flag value. An optional second argument allows you to set what value
will be returned if the flag does not have a value. By default `useFeatureFlag` will return `undefined` if the flag
cannot be found.

```typescript jsx
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent() {
  const myFlagValue = useFeatureFlag('flagIdentifier', 'default value')

  return <p>My flag value is: {myFlagValue}</p>
}
```

### `useFeatureFlags`

The `useFeatureFlags` hooks returns an object of Flag identifier/Flag value pairs. You can pass an array of Flag
identifiers or an object of Flag identifier/default value pairs. If an array is used and a Flag cannot be found, the
returned value for the flag will be `undefined`. If no arguments are passed, all Flags will be returned.

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

const MyConditionalComponent = ifFeatureFlag('flag1', 'ABC123')(MyComponent)
```

You can then use `MyConditionalComponent` as a normal component, only render if `flag1`'s value matches the passed
condition.

### `withFeatureFlags`

The `withFeatureFlags` higher-order component (HOC) wraps your component and adds `flags` as an additional prop. `flags`
contains the evaluations for all known flags.

```typescript jsx
import { withFeatureFlags } from '@harnessio/ff-react-client-sdk'

// ...

function MyComponent({ flags }: { flags: Record<string, any> }) {
  return <p>Flag1's value is {flags.flag1}</p>
}

const MyComponentWithFlags = withFeatureFlags(MyComponent)
```

## Additional Reading

For further examples and config options, see
the [React.js Client SDK Reference](https://docs.harness.io/article/3v7fclfg59-node-js-sdk-reference) and
the [test React.js project](https://github.com/harness/ff-nodejs-server-sdk).
For more information about Feature Flags, see
our [Feature Flags documentation](https://docs.harness.io/article/0a2u2ppp8s-getting-started-with-feature-flags).

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
