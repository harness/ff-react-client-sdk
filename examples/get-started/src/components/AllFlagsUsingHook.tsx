import { FC } from 'react'
import { useFeatureFlags } from '@harnessio/ff-react-client-sdk'
import Loader from './Loader/Loader'

const AllFlagsUsingHook: FC = () => {
  const allFlags = useFeatureFlags()
  const loading = !!Object.keys(allFlags).length

  return (
    <section>
      <h2>All Feature Flags</h2>
      <p>
        Using <code>useFeatureFlags</code> hook.
      </p>
      <samp>{`const flags = useFeatureFlags()`}</samp>
      {!loading ? <Loader /> : <pre>{JSON.stringify(allFlags, null, 2)}</pre>}
    </section>
  )
}

export default AllFlagsUsingHook
