import { FC } from 'react'
import { withFeatureFlags } from '@harnessio/ff-react-client-sdk'
import Loader from './Loader/Loader'

const AllFlagsUsingHOC: FC = withFeatureFlags(({ flags, loading }) => (
  <section>
    <h2>All Feature Flags</h2>
    <p>
      Using <code>withFeatureFlags</code> HOC.
    </p>
    <samp>{`const MyWrappedComponent = withFeatureFlags(MyComponent)`}</samp>
    {loading ? <Loader /> : <pre>{JSON.stringify(flags, null, 2)}</pre>}
  </section>
))

export default AllFlagsUsingHOC
