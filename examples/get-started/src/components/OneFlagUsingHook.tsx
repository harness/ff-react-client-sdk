import { FC } from 'react'
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk'

export interface OneFlagUsingHookProps {
  flag: string
}

const OneFlagUsingHook: FC<OneFlagUsingHookProps> = ({ flag }) => {
  const myFlag = useFeatureFlag(flag)

  return (
    <section>
      <h2>One feature flag</h2>
      <p>
        Using <code>useFeatureFlag</code> hook.
      </p>
      <samp>{`const myFlag = useFeatureFlag('${flag}')`}</samp>
      <p>Flag value is: "{JSON.stringify(myFlag)}"</p>
    </section>
  )
}

export default OneFlagUsingHook
