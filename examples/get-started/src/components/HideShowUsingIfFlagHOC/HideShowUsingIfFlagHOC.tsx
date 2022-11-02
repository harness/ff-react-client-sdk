import { FC } from 'react'
import { ifFeatureFlag } from '@harnessio/ff-react-client-sdk'
import css from './HideShowUsingIfFlagHOC.module.css'
import Loader from '../Loader/Loader'

export interface HideShowUsingIfFlagHOCProps {
  flag1: string
  flag2: string
}

const MyComponent: FC<unknown> = () => (
  <p>The flag is enabled if I can be seen</p>
)

const HideShowUsingIfFlagHOC: FC<HideShowUsingIfFlagHOCProps> = ({
  flag1,
  flag2
}) => {
  const FlagOne = ifFeatureFlag(flag1, { loadingFallback: <Loader /> })(
    MyComponent
  )
  const FlagTwo = ifFeatureFlag(flag2, { loadingFallback: <Loader /> })(
    MyComponent
  )

  return (
    <section>
      <h2>Hide/Show</h2>
      <p>
        Using <code>ifFeatureFlag</code> HOC.
      </p>
      <samp>{`const MyWrappedComponent = ifFeatureFlag('${flag1}')(MyComponent)`}</samp>
      <div className={css.cols}>
        <aside>
          <h3>Flag: "{flag1}"</h3>
          <FlagOne />
        </aside>
        <aside>
          <h3>Flag: "{flag2}"</h3>
          <FlagTwo />
        </aside>
      </div>
    </section>
  )
}

export default HideShowUsingIfFlagHOC
