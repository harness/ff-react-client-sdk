import { FC, MouseEvent, useCallback } from 'react'
import {
  FFContextProvider,
  FFContextProviderProps
} from '@harnessio/ff-react-client-sdk'
import Loader from './components/Loader/Loader'
import AllFlagsUsingHook from './components/AllFlagsUsingHook'
import AllFlagsUsingHOC from './components/AllFlagsUsingHOC'
import OneFlagUsingHook from './components/OneFlagUsingHook'
import HideShowUsingIfFlagHOC from './components/HideShowUsingIfFlagHOC/HideShowUsingIfFlagHOC'
import css from './App.module.css'

const App: FC = () => {
  const useAsyncMode = window.location.search.includes('async=true')

  const target: FFContextProviderProps['target'] = {
    identifier: 'ReactSDK',
    name: 'React SDK',
    attributes: {
      hello: 'world'
    }
  }

  const handleAsyncModeToggle = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      window.location.search = `async=${useAsyncMode ? 'false' : 'true'}`
    },
    []
  )

  return (
    <FFContextProvider
      apiKey="YOUR_API_KEY"
      target={target}
      fallback={<Loader />}
      async={useAsyncMode}
    >
      <article>
        <h1>Feature Flags</h1>
        <button onClick={handleAsyncModeToggle}>
          {useAsyncMode ? 'Use synchronous mode' : 'Use asynchronous mode'}
        </button>
        <div className={css.sections}>
          <AllFlagsUsingHook />
          <AllFlagsUsingHOC />
          <OneFlagUsingHook flag="flag1" />
          <HideShowUsingIfFlagHOC flag1="flag1" flag2="flag2" />
        </div>
      </article>
    </FFContextProvider>
  )
}

export default App
